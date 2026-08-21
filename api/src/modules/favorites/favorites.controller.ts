import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { IsString } from "class-validator";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";

class CreateFavoriteDto {
  @IsString()
  productId: string;
}

/** 门户用户收藏（产品） */
@Controller("favorites")
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly prisma: PrismaService) {}

  private requireUser(payload: JwtPayload) {
    if (payload.kind !== "user") throw new ForbiddenException("仅门户用户可访问");
  }

  @Get()
  async list(@CurrentUser() payload: JwtPayload) {
    this.requireUser(payload);
    const items = await this.prisma.favorite.findMany({
      where: { userId: payload.sub },
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });
    return {
      items: items.map((f) => ({
        productId: f.productId,
        savedAt: f.createdAt.toISOString(),
        product: f.product,
      })),
    };
  }

  /** 幂等收藏 */
  @Post()
  async add(@CurrentUser() payload: JwtPayload, @Body() dto: CreateFavoriteDto) {
    this.requireUser(payload);
    const existing = await this.prisma.favorite.findFirst({
      where: { userId: payload.sub, productId: dto.productId },
    });
    if (existing) return { ok: true, savedAt: existing.createdAt.toISOString() };
    const fav = await this.prisma.favorite.create({
      data: { userId: payload.sub, productId: dto.productId },
    });
    return { ok: true, savedAt: fav.createdAt.toISOString() };
  }

  @Delete(":productId")
  async remove(@CurrentUser() payload: JwtPayload, @Param("productId") productId: string) {
    this.requireUser(payload);
    await this.prisma.favorite.deleteMany({
      where: { userId: payload.sub, productId },
    });
    return { deleted: true };
  }
}
