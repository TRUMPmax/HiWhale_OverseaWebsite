import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { IsString } from "class-validator";
import { FileInterceptor } from "@nestjs/platform-express";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import { UploadsService } from "./uploads.service";

class DeleteUploadDto {
  @IsString()
  key: string;
}

@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  /** 素材列表：GET /api/uploads?page&pageSize&prefix（员工） */
  @UseGuards(JwtAuthGuard)
  @Get()
  list(
    @CurrentUser() payload: JwtPayload,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
    @Query("prefix") prefix?: string,
  ) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可访问");
    return this.uploads.listObjects(
      Math.max(1, Number(page ?? 1)),
      Math.min(100, Math.max(1, Number(pageSize ?? 50))),
      prefix,
    );
  }

  /** 员工上传素材：POST /api/uploads?kind=image|spec|model&key=<覆盖指定 key>（multipart, 字段名 file） */
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @CurrentUser() payload: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Query("kind") kind = "image",
    @Query("key") key?: string,
  ) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可上传");
    return this.uploads.upload(file, kind, key);
  }

  /** 删除素材：DELETE /api/uploads {key} */
  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@CurrentUser() payload: JwtPayload, @Body() dto: DeleteUploadDto) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可删除");
    const result = await this.uploads.deleteObject(dto.key);
    if (!result) throw new NotFoundException("文件不存在");
    return result;
  }
}
