import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import {
  AssignInquiryDto,
  CreateFollowUpDto,
  CreateInquiryDto,
  ListInquiriesDto,
  UpdateInquiryStatusDto,
} from "./dto/inquiries.dto";
import { InquiriesService } from "./inquiries.service";

function requireStaff(payload: JwtPayload) {
  if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
}

function requireSuperAdmin(payload: JwtPayload) {
  requireStaff(payload);
  if (payload.role !== "SUPER_ADMIN") throw new ForbiddenException("仅系统管理员可删除询盘");
}

@Controller("inquiries")
export class InquiriesController {
  constructor(private readonly inquiries: InquiriesService) {}

  /** 公开：门户联系表单提交（IP 限频 5 次/分钟） */
  @Post()
  create(@Body() dto: CreateInquiryDto, @Req() req: Request) {
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    return this.inquiries.create(dto, ip);
  }

  /** 门户用户：我的询盘 */
  @UseGuards(JwtAuthGuard)
  @Get("mine")
  mine(@CurrentUser() payload: JwtPayload) {
    if (payload.kind !== "user") throw new ForbiddenException("仅门户用户可访问");
    return this.inquiries.mine(payload.email);
  }

  // ---- 员工接口 ----
  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() payload: JwtPayload, @Query() query: ListInquiriesDto) {
    requireStaff(payload);
    return this.inquiries.list(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  detail(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    requireStaff(payload);
    return this.inquiries.detail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  setStatus(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: UpdateInquiryStatusDto,
  ) {
    requireStaff(payload);
    return this.inquiries.setStatus(id, dto.status, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/assign")
  assign(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: AssignInquiryDto,
  ) {
    requireStaff(payload);
    return this.inquiries.assign(id, dto.assigneeName, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    requireSuperAdmin(payload);
    return this.inquiries.remove(id, payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/follow-ups")
  addFollowUp(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: CreateFollowUpDto,
  ) {
    requireStaff(payload);
    return this.inquiries.addFollowUp(id, dto.note, payload.sub);
  }
}
