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
