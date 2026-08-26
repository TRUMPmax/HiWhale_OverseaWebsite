# 04 · RAG 检索管线

> **状态：暂缓实施（2026-08-25 业主决策）**。考虑 AI API 检索成本，上线初期 AI 客服使用 FAQ 驱动（`chat.service.ts` 已把 `faqs` 表内容注入 system prompt，后台知识库 FAQ CRUD 即为维护入口）。待业主接入产品手册且需要文档级问答时再按本文档实施。
> 先读 [README.md](README.md) §0 项目速览。范围：仅 `api/src/modules/knowledge/` 与 `docker-compose.yml` 的 TEI 服务段。chat 模块的集成点**已存在**，不要改 chat.service.ts。

## 目标

知识库文档从"上传即死"变为完整 RAG 管线：上传 → 解析 → 分块 → bge-m3 embedding → pgvector 入库 → 混合检索（向量+全文）→ rerank → AI 对话自动带上下文。

## 边界

- **负责**：文档解析、分块、embedding、检索、重排、向量化状态推进、失败重试端点
- **不负责**：chat 的 SSE/会话逻辑（已完整）、FAQ 消费（见"后续可选"）、文档上传 UI（已完整）

## 现有资产（已存在，必须使用，不得重建）

### 1. 接口桩（`api/src/modules/knowledge/retrieval.service.ts` 全文）

```ts
import { Injectable } from "@nestjs/common";

export type RetrievedChunk = {
  id: string;
  content: string;
  /** 0-1 相关性得分 */
  score: number;
  documentId: string;
  fileName: string;
};

@Injectable()
export class RetrievalService {
  /**
   * TODO（开发指南 6.4/6.5）：检索增强实现
   * 1. 查询改写（query rewrite，DeepSeek）
   * 2. 混合检索：pgvector 向量相似度 + tsvector 全文检索（document_chunks）
   * 3. Rerank（bge-reranker / TEI）
   * 当前为接口桩：始终返回空数组（ChatService 在无结果时不附加上下文）。
   */
  async retrieveContext(
    _query: string,
    _opts?: { productModel?: string; topK?: number },
  ): Promise<RetrievedChunk[]> {
    return [];
  }
}
```

**签名不得更改**——`chat.service.ts:80-82` 已在调用：

```ts
const chunks = await this.retrieval.retrieveContext(dto.message, {
  productModel: conversation.productContext ?? undefined,
});
// chunks.length > 0 时拼入 systemPrompt（chat.service.ts:87-89 已实现）
```

### 2. Schema（已建表 + 迁移含 pgvector/tsvector，勿改结构）

`KnowledgeDocument`：`id, fileName, fileType, fileUrl, productModel?, category?, language(默认"zh"), vectorStatus(PENDING|PROCESSING|DONE|FAILED), errorMessage?, uploadedById?, chunks DocumentChunk[]`

`DocumentChunk`（schema.prisma:313-334）：

```prisma
model DocumentChunk {
  id            String    @id @default(uuid()) @db.Uuid
  documentId    String    @map("document_id") @db.Uuid
  document      KnowledgeDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  parentChunkId String?   @map("parent_chunk_id") @db.Uuid
  parentChunk   DocumentChunk?    @relation("ChunkHierarchy", fields: [parentChunkId], references: [id])
  childChunks   DocumentChunk[]   @relation("ChunkHierarchy")
  chunkIndex    Int       @map("chunk_index")
  content       String
  contentEn     String?   @map("content_en")
  embedding     Unsupported("vector(1024)")?   // bge-m3，1024 维
  searchVector  Unsupported("tsvector")?       @map("search_vector")  // 迁移里有生成逻辑
  metadata      Json?
  createdAt     DateTime  @default(now()) @map("created_at")
}
```

注意：`embedding`/`searchVector` 是 `Unsupported` 类型，**Prisma Client 无法直接写**——用 `prisma.$executeRaw` 写入（参考迁移 0001_init 中的 SQL 惯例）。

### 3. 上传入口（`knowledge.service.ts:14-32`）

`uploadDocument()` 已把文件入 MinIO + 记录入库（`vectorStatus: "PROCESSING"`，:17-18 有 TODO 自认）。实施时在此处触发管线。

### 4. 基础设施

- `docker-compose.yml:63-77`：TEI（`ghcr.io/huggingface/text-embeddings-inference`，bge-m3）服务段**已写好但被注释**，启用即可
- `.env.example:41-43`：`EMBEDDING_API_URL`（TEI 端点，如 `http://tei:80`）、`RERANK_API_URL`、`HF_TOKEN` 已预留但代码零引用——本模块负责让它们生效
- DeepSeek 可用于查询改写：`process.env.DEEPSEEK_API_KEY` + `${DEEPSEEK_BASE_URL ?? "https://api.deepseek.com"}/chat/completions`（参照 chat.service.ts:97-119 的 fetch 用法）

## 实施规格

### 1. 解析与分块 `api/src/modules/knowledge/ingest.service.ts`（新建）

- 支持格式：PDF / DOCX / MD / TXT（依赖建议：`pdf-parse`、`mammoth`；安装到 api 包）
- 从 MinIO 拉文件：注入 `UploadsService`，按其现有 MinIO client 模式读取对象流（uploads.service.ts 内可找到 client 构建方式）
- 父子分块：父块 ~1000 字（返回上下文用）、子块 ~300 字（检索用），`parentChunkId` 关联；中英文内容都写 `content`（bge-m3 多语言，`contentEn` 可留空）
- 状态机：PENDING → PROCESSING →（全部子块写入成功）DONE /（任何失败）FAILED + `errorMessage`
- 触发：`uploadDocument()` 创建记录后 `void this.ingest.process(doc.id)`（fire-and-forget；单实例同步处理即可，**不引入队列**）
- 重试：knowledge controller 加 `POST /api/knowledge/documents/:id/revectorize`（员工鉴权）→ 删除旧 chunks + 重置状态 + 重新触发；admin 知识库页"重试"按钮（`knowledge-base/page.tsx:114-117` 现为假 toast）接通此端点

### 2. Embedding 客户端 `api/src/modules/knowledge/embedding.service.ts`（新建）

```ts
@Injectable()
export class EmbeddingService {
  isConfigured(): boolean; // EMBEDDING_API_URL 非空
  /** TEI /embed 接口：POST { inputs: string[] } → number[][]；批量 ≤32 */
  embed(texts: string[]): Promise<number[][]>;
}
```

### 3. 检索实现（填 `retrieval.service.ts`）

1. **查询改写**（可选增强，开关 `RAG_QUERY_REWRITE !== "off"`）：DeepSeek 把口语 query 改写成检索关键词；失败/未配置则用原 query
2. **混合检索**（`$queryRaw`）：
   - 向量：`SELECT id, content, document_id, 1 - (embedding <=> $1::vector) AS score FROM document_chunks WHERE embedding IS NOT NULL ORDER BY embedding <=> $1::vector LIMIT 20`（`opts.productModel` 存在时 JOIN knowledge_documents 加 `product_model = $x` 过滤）
   - 全文：`WHERE "search_vector" @@ plainto_tsquery('simple', $1)`（中英混排用 simple 配置；若迁移建了中文分词配置以迁移为准）
   - RRF 融合（`score = 1/(60+rank)`）取 top 20
3. **Rerank**（`RERANK_API_URL` 配置时）：POST `{ query, texts }` 到 reranker（bge-reranker-v2-m3，TEI 兼容 `/rerank`）；取 topK（默认 5）；未配置则直接用 RRF 分数 topK
4. 子块命中后回取父块 `content` 作为返回 `content`（父子分块的意义）；`fileName` 从 document 关联取
5. 任何步骤失败：`console.error` 并返回 `[]`（chat 对空结果有降级，绝不能让检索故障炸掉对话）

### 4. 前端小改（admin）

- 知识库页"重试"按钮 → 调 `POST /api/knowledge/documents/:id/revectorize`，toast 反馈
- "测试问答"区（knowledge-base/page.tsx:301-336 现为固定占位文案）→ 调 portal 同款 `POST /api/chat` 不便（需用户 JWT），改为新端点 `POST /api/knowledge/test-retrieval`（员工鉴权，body `{ query }`）直接返回 `RetrievedChunk[]` 渲染

## 验收

1. 启用 TEI 后上传一份产品手册 PDF → 该文档 vectorStatus 变 DONE，`select count(*) from document_chunks` > 0
2. portal AI 对话问手册内具体问题 → 回答包含手册内容（systemPrompt 注入了检索上下文）
3. TEI 未配置时：文档状态 FAILED + errorMessage 明确，AI 对话照常工作（无上下文）
4. `POST /api/knowledge/test-retrieval` 返回带 score 的块列表
5. `pnpm type-check && pnpm lint` 全绿

## 禁止事项

- 不改 `retrieveContext` 签名、不改 chat.service.ts
- 不引入消息队列/定时任务框架（fire-and-forget + 手动重试足够）
- 不改 DocumentChunk 表结构；写向量只能走 `$executeRaw`/`$queryRaw`
- 文档解析失败不得删除 MinIO 原文件
