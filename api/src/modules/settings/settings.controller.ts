import { Body, Controller, ForbiddenException, Get, Param, Put, UseGuards } from "@nestjs/common";
import { IsNotEmpty } from "class-validator";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";

class PutSettingDto {
  @IsNotEmpty({ message: "value 不能为空" })
  value: unknown;
}

/** 站点设置 KV 存取（员工） */
@Controller("settings")
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly prisma: PrismaService) {}

  private requireStaff(payload: JwtPayload) {
    if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
  }

  @Get(":key")
  async get(@CurrentUser() payload: JwtPayload, @Param("key") key: string) {
    this.requireStaff(payload);
    const row = await this.prisma.siteSetting.findUnique({ where: { key } });
    return { key, value: row?.value ?? null };
  }

  @Put(":key")
  async put(
    @CurrentUser() payload: JwtPayload,
    @Param("key") key: string,
    @Body() dto: PutSettingDto,
  ) {
    this.requireStaff(payload);
    const value = JSON.parse(JSON.stringify(dto.value)) as object;
    const row = await this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return { key: row.key, value: row.value };
  }
}
