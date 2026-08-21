import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      // 数据库未就绪时允许服务启动（/health/db 会报告 db: down）
      console.warn("[api] database not reachable at startup, continuing without connection");
    }
  }

  enableShutdownHooks(app: INestApplication) {
    process.on("beforeExit", () => void app.close());
  }
}
