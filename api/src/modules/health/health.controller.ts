import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  /** 数据库连通性检查：DB 不可用时仍返回 200 + db: down */
  @Get("db")
  async db() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", db: "up", timestamp: new Date().toISOString() };
    } catch {
      return { status: "ok", db: "down", timestamp: new Date().toISOString() };
    }
  }
}
