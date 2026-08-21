import { Controller, ForbiddenException, Get, Query, UseGuards } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";

@Controller("logs")
@UseGuards(JwtAuthGuard)
export class LogsController {
  constructor(private readonly prisma: PrismaService) {}

  /** 操作日志（员工，分页） */
  @Get()
  async list(@CurrentUser() payload: JwtPayload, @Query("page") page?: string) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可访问");
    const p = Math.max(1, Number(page ?? 1));
    const pageSize = 20;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.operationLog.count(),
      this.prisma.operationLog.findMany({
        orderBy: { createdAt: "desc" },
        skip: (p - 1) * pageSize,
        take: pageSize,
        include: { staff: { select: { name: true } } },
      }),
    ]);
    return {
      items: items.map((l) => ({
        id: l.id,
        time: l.createdAt.toISOString(),
        operator: l.staff.name,
        action: l.action,
        target: l.target,
      })),
      total,
      page: p,
      pageSize,
    };
  }
}
