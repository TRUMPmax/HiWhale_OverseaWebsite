import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UploadsService } from "../uploads/uploads.service";
import type { ImportFaqsDto, UploadDocMetaDto, UpsertFaqDto } from "./dto/knowledge.dto";

/** 简易 CSV 解析：支持引号包裹字段（内嵌逗号/换行/双引号转义） */
function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

@Injectable()
export class KnowledgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploads: UploadsService,
  ) {}

  /** 上传知识库文档：文件入 MinIO，记录入库（PROCESSING，向量化管线待接入） */
  async uploadDocument(file: Express.Multer.File, meta: UploadDocMetaDto, staffId: string) {
    const { url, key } = await this.uploads.upload(file, "doc");
    const ext = file.originalname.split(".").pop()?.toUpperCase() ?? "";
    // TODO（开发指南 6.4）：接入向量化管线（解析 → 分块 → bge-m3 embedding → document_chunks）
    // 当前状态固定为 PROCESSING，由后续后台任务推进到 DONE / FAILED
    const doc = await this.prisma.knowledgeDocument.create({
      data: {
        fileName: file.originalname,
        fileType: ext,
        fileUrl: url,
        productModel: meta.productModel,
        category: meta.category,
        language: meta.language ?? "zh",
        vectorStatus: "PROCESSING",
        uploadedById: staffId,
      },
    });
    return { ...doc, objectKey: key };
  }

  listDocuments() {
    return this.prisma.knowledgeDocument.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { chunks: true } } },
    });
  }

  async deleteDocument(id: string) {
    const exists = await this.prisma.knowledgeDocument.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("文档不存在");
    await this.prisma.knowledgeDocument.delete({ where: { id } });
    return { deleted: true };
  }

  // ---- FAQ ----
  listFaqs() {
    return this.prisma.faq.findMany({ orderBy: { createdAt: "desc" } });
  }

  createFaq(dto: UpsertFaqDto) {
    return this.prisma.faq.create({ data: dto });
  }

  /** FAQ 导出 CSV（UTF-8 带 BOM，Excel 可直接打开；列：question,answer,questionEn,answerEn） */
  async exportFaqsCsv(): Promise<string> {
    const faqs = await this.prisma.faq.findMany({ orderBy: { createdAt: "desc" } });
    const esc = (v: string | null | undefined) => `"${(v ?? "").replaceAll('"', '""')}"`;
    const rows = faqs.map((f) =>
      [esc(f.question), esc(f.answer), esc(f.questionEn), esc(f.answerEn)].join(","),
    );
    return "﻿question,answer,questionEn,answerEn\n" + rows.join("\n");
  }

  /** FAQ 批量导入（追加模式：文件内与库内按 question 去重，重复的跳过） */
  async importFaqsCsv(csv: string) {
    const rows = parseCsv(csv.replace(/^﻿/, ""));
    // 首行是表头则丢弃
    if (rows.length > 0 && rows[0][0]?.trim().toLowerCase() === "question") rows.shift();

    const existing = await this.prisma.faq.findMany({ select: { question: true } });
    const seen = new Set(existing.map((f) => f.question.trim()));

    const toCreate: Array<{
      question: string;
      answer: string;
      questionEn?: string;
      answerEn?: string;
    }> = [];
    let skipped = 0;
    let invalid = 0;
    for (const cols of rows) {
      const [question, answer, questionEn, answerEn] = cols.map((c) => c?.trim() ?? "");
      if (!question && !answer) continue; // 空行
      if (!question || !answer) {
        invalid++;
        continue;
      }
      if (seen.has(question)) {
        skipped++;
        continue;
      }
      seen.add(question);
      toCreate.push({
        question,
        answer,
        ...(questionEn ? { questionEn } : {}),
        ...(answerEn ? { answerEn } : {}),
      });
    }
    if (toCreate.length > 0) {
      await this.prisma.faq.createMany({ data: toCreate });
    }
    return { imported: toCreate.length, skipped, invalid };
  }

  async updateFaq(id: string, dto: Partial<UpsertFaqDto>) {
    const exists = await this.prisma.faq.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("FAQ 不存在");
    return this.prisma.faq.update({ where: { id }, data: dto });
  }

  async deleteFaq(id: string) {
    const exists = await this.prisma.faq.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("FAQ 不存在");
    await this.prisma.faq.delete({ where: { id } });
    return { deleted: true };
  }
}
