import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import { ReorderDto, UpsertCategoryDto, UpsertGroupDto } from "./dto/taxonomy.dto";
import { TaxonomyService } from "./taxonomy.service";

@Controller("taxonomy")
export class TaxonomyController {
  constructor(private readonly taxonomy: TaxonomyService) {}

  private requireStaff(payload: JwtPayload) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
  }

  /** 公开：完整分类树 */
  @Get()
  tree() {
    return this.taxonomy.tree();
  }

  // ---------- 拖动排序（员工） ----------
  @UseGuards(JwtAuthGuard)
  @Put("groups/reorder")
  reorderGroups(@CurrentUser() payload: JwtPayload, @Body() dto: ReorderDto) {
    this.requireStaff(payload);
    return this.taxonomy.reorderGroups(dto.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Put("categories/reorder")
  reorderCategories(@CurrentUser() payload: JwtPayload, @Body() dto: ReorderDto) {
    this.requireStaff(payload);
    return this.taxonomy.reorderCategories(dto.ids);
  }

  // ---------- 大类（员工） ----------
  @UseGuards(JwtAuthGuard)
  @Post("groups")
  createGroup(@CurrentUser() payload: JwtPayload, @Body() dto: UpsertGroupDto) {
    this.requireStaff(payload);
    return this.taxonomy.createGroup(dto, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put("groups/:id")
  updateGroup(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: Partial<UpsertGroupDto>,
  ) {
    this.requireStaff(payload);
    return this.taxonomy.updateGroup(id, dto, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("groups/:id")
  deleteGroup(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Query("cascade") cascade?: string,
  ) {
    this.requireStaff(payload);
    return this.taxonomy.deleteGroup(id, cascade === "true", payload.sub);
  }

  // ---------- 品类（员工） ----------
  @UseGuards(JwtAuthGuard)
  @Post("categories")
  createCategory(@CurrentUser() payload: JwtPayload, @Body() dto: UpsertCategoryDto) {
    this.requireStaff(payload);
    return this.taxonomy.createCategory(dto, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put("categories/:id")
  updateCategory(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: Partial<UpsertCategoryDto>,
  ) {
    this.requireStaff(payload);
    return this.taxonomy.updateCategory(id, dto, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("categories/:id")
  deleteCategory(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Query("cascade") cascade?: string,
  ) {
    this.requireStaff(payload);
    return this.taxonomy.deleteCategory(id, cascade === "true", payload.sub);
  }
}
