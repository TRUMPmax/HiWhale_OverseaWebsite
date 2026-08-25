import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { OperationLogService } from "../logs/logs.module";
import type { CreateStaffDto, UpdateStaffDto } from "./dto/staff.dto";

@Injectable()
export class StaffService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logs: OperationLogService,
  ) {}

  /** Prisma 枚举 ACTIVE/DISABLED → 前端约定的小写 active/disabled */
  private mapStatus<T extends { status: string }>(staff: T) {
    return { ...staff, status: staff.status.toLowerCase() };
  }

  async list() {
    const items = await this.prisma.staffUser.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        _count: { select: { assignedInquiries: true } },
      },
    });
    return items.map((s) => this.mapStatus(s));
  }

  async create(dto: CreateStaffDto, operatorId: string) {
    try {
      const staff = await this.prisma.staffUser.create({
        data: {
          name: dto.name,
          email: dto.email.toLowerCase(),
          role: dto.role,
          passwordHash: await bcrypt.hash(dto.password, 10),
        },
        select: { id: true, name: true, email: true, role: true, status: true },
      });
      await this.logs.log(operatorId, "新增员工", `${staff.name}（${staff.email}）`);
      return this.mapStatus(staff);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("该邮箱已存在");
      }
      throw e;
    }
  }

  async update(id: string, dto: UpdateStaffDto, operatorId: string) {
    const exists = await this.prisma.staffUser.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("员工不存在");
    const staff = await this.prisma.staffUser.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.role !== undefined ? { role: dto.role } : {}),
      },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    await this.logs.log(operatorId, "编辑员工", staff.name);
    return this.mapStatus(staff);
  }

  async setStatus(id: string, status: "active" | "disabled", operatorId: string) {
    if (id === operatorId) throw new BadRequestException("不能禁用自己的账号");
    const exists = await this.prisma.staffUser.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("员工不存在");
    const staff = await this.prisma.staffUser.update({
      where: { id },
      data: { status: status === "active" ? "ACTIVE" : "DISABLED" },
      select: { id: true, name: true, status: true },
    });
    await this.logs.log(operatorId, status === "active" ? "启用员工" : "禁用员工", staff.name);
    return this.mapStatus(staff);
  }

  async remove(id: string, operatorId: string) {
    if (id === operatorId) throw new BadRequestException("不能删除自己的账号");
    const target = await this.prisma.staffUser.findUnique({ where: { id } });
    if (!target) throw new NotFoundException("员工不存在");
    if (target.role === "SUPER_ADMIN") {
      const superAdmins = await this.prisma.staffUser.count({
        where: { role: "SUPER_ADMIN", status: "ACTIVE" },
      });
      if (superAdmins <= 1) throw new BadRequestException("至少保留一名超级管理员");
    }
    // 释放名下询盘（释放为未分配，可由其他员工继续跟进）
    const released = await this.prisma.inquiry.updateMany({
      where: { assigneeId: id },
      data: { assigneeId: null },
    });
    await this.prisma.staffUser.delete({ where: { id } });
    await this.logs.log(
      operatorId,
      "删除员工",
      `${target.name}（${target.email}），释放询盘 ${released.count} 条`,
    );
    return { deleted: true, releasedInquiries: released.count };
  }
}
