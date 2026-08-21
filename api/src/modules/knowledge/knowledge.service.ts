import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { UploadsService } from "../uploads/uploads.service";
import type { UploadDocMetaDto, UpsertFaqDto } from "./dto/knowledge.dto";

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
