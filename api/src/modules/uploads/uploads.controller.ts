import {
  Controller,
  ForbiddenException,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  /** 员工上传素材：POST /api/uploads?kind=image|spec|model（multipart, 字段名 file） */
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @CurrentUser() payload: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Query("kind") kind = "image",
  ) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可上传");
    return this.uploads.upload(file, kind);
  }
}
