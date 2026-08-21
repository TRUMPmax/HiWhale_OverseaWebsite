import { Global, Injectable, Module } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { LogsController } from "./logs.controller";

@Injectable()
export class OperationLogService {
  constructor(private readonly prisma: PrismaService) {}

  /** 记录操作日志（轻量同步调用，失败不影响主流程） */
  async log(staffId: string, action: string, target: string, detail?: unknown) {
    try {
      await this.prisma.operationLog.create({
        data: {
          staffId,
          action,
          target,
          detail: detail === undefined ? undefined : JSON.parse(JSON.stringify(detail)),
        },
      });
    } catch (e) {
      console.warn("[logs] failed to write operation log:", e);
    }
  }
}

@Global()
@Module({
  controllers: [LogsController],
  providers: [OperationLogService],
  exports: [OperationLogService],
})
export class LogsModule {}
