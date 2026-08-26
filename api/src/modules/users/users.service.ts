import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { OperationLogService } from "../logs/logs.module";
import type { ListUsersDto, UpdateProfileDto } from "./dto/users.dto";

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logs: OperationLogService,
  ) {}

  /** 员工：门户用户列表（搜索/分页） */
  async list(query: ListUsersDto) {
    const page = Math.max(1, Number(query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize ?? 20)));
    const search = query.search?.trim();
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { company: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};
    const [total, items] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return {
      items: items.map((u) => ({
        id: u.id,
        name: u.name,
        company: u.company,
        email: u.email,
        country: u.country,
        registeredAt: u.createdAt.toISOString().slice(0, 10),
        aiChatCount: u.aiUsageCount,
        status: u.status === "ACTIVE" ? "active" : "disabled",
      })),
      total,
      page,
      pageSize,
    };
  }

  /** 员工：用户详情（含 AI 使用量与近期询盘） */
  async detail(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("用户不存在");
    const inquiries = await this.prisma.inquiry.findMany({
      where: { email: user.email },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, createdAt: true, description: true, status: true },
    });
    return {
      id: user.id,
      name: user.name,
      company: user.company,
      email: user.email,
      phone: user.phone,
      country: user.country,
      registeredAt: user.createdAt.toISOString().slice(0, 10),
      aiChatCount: user.aiUsageCount,
      status: user.status === "ACTIVE" ? "active" : "disabled",
      recentInquiries: inquiries.map((i) => ({
        id: i.id,
        date: i.createdAt.toISOString().slice(0, 10),
        summary: i.description.slice(0, 50),
        status: i.status,
      })),
    };
  }

  async setStatus(id: string, status: "active" | "disabled") {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("用户不存在");
    await this.prisma.user.update({
      where: { id },
      data: { status: status === "active" ? "ACTIVE" : "DISABLED" },
    });
    return { ok: true };
  }

  /** 员工（SUPER_ADMIN）：硬删除门户用户（收藏/AI 会话随 schema 级联清理） */
  async remove(id: string, operatorId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("用户不存在");
    await this.prisma.user.delete({ where: { id } });
    if (operatorId) await this.logs.log(operatorId, "删除门户用户", user.email);
    return { ok: true };
  }

  /** 员工：用户统计（仪表盘卡片） */
  async stats() {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const [total, active, newThisMonth] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: "ACTIVE" } }),
      this.prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    ]);
    return { total, active, newThisMonth };
  }

  /** 门户用户：自己的资料 */
  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("用户不存在");
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      country: user.country,
    };
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.company !== undefined ? { company: dto.company } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.country !== undefined ? { country: dto.country } : {}),
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      country: user.country,
    };
  }
}
