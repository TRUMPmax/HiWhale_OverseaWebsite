import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import { ImportFaqsDto, UploadDocMetaDto, UpsertFaqDto } from "./dto/knowledge.dto";
import { KnowledgeService } from "./knowledge.service";

@Controller("knowledge")
@UseGuards(JwtAuthGuard)
export class KnowledgeController {
  constructor(private readonly knowledge: KnowledgeService) {}

  private requireStaff(payload: JwtPayload) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
  }

  /** 上传文档（multipart 字段 file；query: productModel/category/language） */
  @Post("documents")
  @UseInterceptors(FileInterceptor("file"))
  uploadDocument(
    @CurrentUser() payload: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Query() meta: UploadDocMetaDto,
  ) {
    this.requireStaff(payload);
    return this.knowledge.uploadDocument(file, meta, payload.sub);
  }

  @Get("documents")
  listDocuments(@CurrentUser() payload: JwtPayload) {
    this.requireStaff(payload);
    return this.knowledge.listDocuments();
  }

  @Delete("documents/:id")
  deleteDocument(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    this.requireStaff(payload);
    return this.knowledge.deleteDocument(id);
  }

  // ---- FAQ ----
  @Get("faqs")
  listFaqs(@CurrentUser() payload: JwtPayload) {
    this.requireStaff(payload);
    return this.knowledge.listFaqs();
  }

  @Post("faqs")
  createFaq(@CurrentUser() payload: JwtPayload, @Body() dto: UpsertFaqDto) {
    this.requireStaff(payload);
    return this.knowledge.createFaq(dto);
  }

  /** FAQ 导出 CSV（声明在 faqs/:id 之前避免路由冲突） */
  @Get("faqs/export")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Header("Content-Disposition", 'attachment; filename="faqs.csv"')
  exportFaqs(@CurrentUser() payload: JwtPayload) {
    this.requireStaff(payload);
    return this.knowledge.exportFaqsCsv();
  }

  /** FAQ 批量导入（追加模式，按 question 去重跳过） */
  @Post("faqs/import")
  importFaqs(@CurrentUser() payload: JwtPayload, @Body() dto: ImportFaqsDto) {
    this.requireStaff(payload);
    return this.knowledge.importFaqsCsv(dto.csv);
  }

  @Put("faqs/:id")
  updateFaq(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: Partial<UpsertFaqDto>,
  ) {
    this.requireStaff(payload);
    return this.knowledge.updateFaq(id, dto);
  }

  @Delete("faqs/:id")
  deleteFaq(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    this.requireStaff(payload);
    return this.knowledge.deleteFaq(id);
  }
}
