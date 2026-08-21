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
import { CreateStaffDto, UpdateStaffDto, UpdateStaffStatusDto } from "./dto/staff.dto";
import { StaffService } from "./staff.service";

@Controller("staff")
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staff: StaffService) {}

  /** 仅超级管理员可管理员工 */
  private requireSuperAdmin(payload: JwtPayload) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可访问");
    if (payload.role !== "SUPER_ADMIN") throw new ForbiddenException("仅超级管理员可操作");
  }

  @Get()
  list(@CurrentUser() payload: JwtPayload) {
    this.requireSuperAdmin(payload);
    return this.staff.list();
  }

  @Post()
  create(@CurrentUser() payload: JwtPayload, @Body() dto: CreateStaffDto) {
    this.requireSuperAdmin(payload);
    return this.staff.create(dto, payload.sub);
  }

  @Put(":id")
  update(@CurrentUser() payload: JwtPayload, @Param("id") id: string, @Body() dto: UpdateStaffDto) {
    this.requireSuperAdmin(payload);
    return this.staff.update(id, dto, payload.sub);
  }

  @Patch(":id/status")
  setStatus(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: UpdateStaffStatusDto,
  ) {
    this.requireSuperAdmin(payload);
    return this.staff.setStatus(id, dto.status, payload.sub);
  }

  @Delete(":id")
  remove(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    this.requireSuperAdmin(payload);
    return this.staff.remove(id, payload.sub);
  }
}
