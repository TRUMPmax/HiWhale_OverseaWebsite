import { Controller, ForbiddenException, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";

@Controller("stats")
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly prisma: PrismaService) {}

  /** 仪表盘统计 + 30 天趋势 + 最近询盘（员工） */
  @Get("dashboard")
  async dashboard(@CurrentUser() payload: JwtPayload) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可访问");

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const trendStart = new Date(todayStart.getTime() - 29 * 86400000);

    const [todayInquiries, monthUsers, aiConversations, inquiries, chatMessages] =
      await this.prisma.$transaction([
        this.prisma.inquiry.count({ where: { createdAt: { gte: todayStart } } }),
        this.prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
        this.prisma.chatConversation.count(),
        this.prisma.inquiry.findMany({
          where: { createdAt: { gte: trendStart } },
          select: { createdAt: true },
        }),
        this.prisma.chatMessage.findMany({
          where: { createdAt: { gte: trendStart }, role: "user" },
          select: { createdAt: true },
        }),
      ]);

    // 30 天趋势（按天聚合）
    const days: string[] = [];
    for (let i = 0; i < 30; i++) {
      days.push(new Date(trendStart.getTime() + i * 86400000).toISOString().slice(0, 10));
    }
    const countByDay = (rows: Array<{ createdAt: Date }>) => {
      const map = new Map<string, number>();
      for (const r of rows) {
        const key = r.createdAt.toISOString().slice(0, 10);
        map.set(key, (map.get(key) ?? 0) + 1);
      }
      return days.map((d) => map.get(d) ?? 0);
    };

    const recentInquiries = await this.prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { assignee: { select: { name: true } } },
    });

    return {
      todayInquiries,
      monthUsers,
      aiConversations,
      trend: days.map((d, i) => ({
        date: `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}`,
        inquiries: countByDay(inquiries)[i],
        ai: countByDay(chatMessages)[i],
      })),
      recentInquiries: recentInquiries.map((i) => ({
        id: i.id,
        customer: i.fullName,
        company: i.company,
        country: i.country,
        categories: i.categories,
        status: i.status,
        time: i.createdAt.toISOString().slice(0, 16).replace("T", " "),
        assignee: i.assignee?.name ?? "未分配",
      })),
    };
  }
}
