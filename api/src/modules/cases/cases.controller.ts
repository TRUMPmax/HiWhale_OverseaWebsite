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
import { CasesService } from "./cases.service";
import { UpdateCaseStatusDto, UpsertCaseDto } from "./dto/cases.dto";

function requireStaff(payload: JwtPayload) {
  if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
}

@Controller("cases")
export class CasesController {
  constructor(private readonly cases: CasesService) {}

  // ---- 公开接口（仅已发布） ----
  @Get()
  listPublic() {
    return this.cases.list(true);
  }

  // ---- 员工接口 ----
  @UseGuards(JwtAuthGuard)
  @Get("admin/all")
  listAll(@CurrentUser() payload: JwtPayload) {
    requireStaff(payload);
    return this.cases.list(false);
  }

  @Get(":slug")
  detail(@Param("slug") slug: string) {
    return this.cases.bySlug(slug, true);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() payload: JwtPayload, @Body() dto: UpsertCaseDto) {
    requireStaff(payload);
    return this.cases.create(dto, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: Partial<UpsertCaseDto>,
  ) {
    requireStaff(payload);
    return this.cases.update(id, dto, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  setStatus(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: UpdateCaseStatusDto,
  ) {
    requireStaff(payload);
    return this.cases.setStatus(id, dto.status, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    requireStaff(payload);
    return this.cases.remove(id, payload.sub);
  }
}
