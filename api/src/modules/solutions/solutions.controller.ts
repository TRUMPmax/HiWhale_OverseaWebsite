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
  UseGuards,
} from "@nestjs/common";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import { UpdateSolutionStatusDto, UpsertSolutionDto } from "./dto/solutions.dto";
import { SolutionsService } from "./solutions.service";

function requireStaff(payload: JwtPayload) {
  if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
}

@Controller("solutions")
export class SolutionsController {
  constructor(private readonly solutions: SolutionsService) {}

  // ---- 公开接口（仅已发布） ----
  @Get()
  listPublic() {
    return this.solutions.list(true);
  }

  // ---- 员工接口 ----
  @UseGuards(JwtAuthGuard)
  @Get("admin/all")
  listAll(@CurrentUser() payload: JwtPayload) {
    requireStaff(payload);
    return this.solutions.list(false);
  }

  @Get(":slug")
  detail(@Param("slug") slug: string) {
    return this.solutions.bySlug(slug, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() payload: JwtPayload, @Body() dto: UpsertSolutionDto) {
    requireStaff(payload);
    return this.solutions.create(dto, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: Partial<UpsertSolutionDto>,
  ) {
    requireStaff(payload);
    return this.solutions.update(id, dto, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  setStatus(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: UpdateSolutionStatusDto,
  ) {
    requireStaff(payload);
    return this.solutions.setStatus(id, dto.status, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    requireStaff(payload);
    return this.solutions.remove(id, payload.sub);
  }
}
