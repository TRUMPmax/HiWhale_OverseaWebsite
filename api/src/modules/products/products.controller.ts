import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import { ListProductsDto, UpdateStatusDto, UpsertProductDto } from "./dto/products.dto";
import { ProductsService } from "./products.service";

/** 仅允许员工（staff JWT） */
function requireStaff(payload: JwtPayload) {
  if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
}

@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  // ---- 公开接口（仅上架产品） ----
  @Get()
  listPublic(@Query() query: ListProductsDto) {
    return this.products.list(query, true);
  }

  // ---- 员工接口（声明在 :slug 之前，避免路由冲突） ----
  @UseGuards(JwtAuthGuard)
  @Get("admin/all")
  listAll(@CurrentUser() payload: JwtPayload) {
    requireStaff(payload);
    return this.products.list({ page: 1, pageSize: 200, status: "all" }, false);
  }

  @Get(":slug")
  detail(@Param("slug") slug: string) {
    return this.products.bySlug(slug, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() payload: JwtPayload, @Body() dto: UpsertProductDto) {
    requireStaff(payload);
    return this.products.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: Partial<UpsertProductDto>,
  ) {
    requireStaff(payload);
    return this.products.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  setStatus(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    requireStaff(payload);
    return this.products.setStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    requireStaff(payload);
    return this.products.remove(id);
  }
}
