import { Injectable, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import type { InquiryStatus } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { OperationLogService } from "../logs/logs.module";
import type { CreateInquiryDto, ListInquiriesDto } from "./dto/inquiries.dto";

/** 询盘提交限频：每 IP 每分钟 5 次（内存实现，单实例够用） */
const submitTimestamps = new Map<string, number[]>();
function throttle(ip: string) {
  const now = Date.now();
  const windowStart = now - 60_000;
  const list = (submitTimestamps.get(ip) ?? []).filter((t) => t > windowStart);
  if (list.length >= 5) {
    throw new HttpException("提交过于频繁，请稍后再试", HttpStatus.TOO_MANY_REQUESTS);
  }
  list.push(now);
  submitTimestamps.set(ip, list);
}

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logs: OperationLogService,
  ) {}

  /** 公开：门户联系表单提交 */
  async create(dto: CreateInquiryDto, ip: string) {
    throttle(ip);
    const inquiry = await this.prisma.inquiry.create({
      data: {
        fullName: dto.fullName,
        company: dto.company,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        country: dto.country,
        categories: dto.categories,
        description: dto.description,
        status: "NEW",
      },
    });
    return { id: inquiry.id, createdAt: inquiry.createdAt };
  }

  /** 门户用户：我的询盘（含跟进记录，按邮箱匹配） */
  async mine(email: string) {
    const items = await this.prisma.inquiry.findMany({
      where: { email: email.toLowerCase() },
      orderBy: { createdAt: "desc" },
      include: {
        followUps: { orderBy: { createdAt: "desc" }, include: { author: true } },
      },
    });
    return {
      items: items.map((i) => ({
        id: i.id,
        date: i.createdAt.toISOString().slice(0, 10),
        categories: i.categories,
        status: i.status,
        description: i.description,
        followUps: i.followUps.map((f) => ({
          ts: f.createdAt.toISOString(),
          author: f.author?.name ?? "系统",
          note: f.note,
        })),
      })),
    };
  }

  /** 员工：列表（状态/搜索/分页） */
  async list(query: ListInquiriesDto) {
    const page = Math.max(1, Number(query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize ?? 20)));
    const search = query.search?.trim();
    const where = {
      ...(query.status ? { status: query.status as InquiryStatus } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: "insensitive" as const } },
              { company: { contains: search, mode: "insensitive" as const } },
              { country: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const [total, items] = await this.prisma.$transaction([
      this.prisma.inquiry.count({ where }),
      this.prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { assignee: { select: { name: true } } },
      }),
    ]);
    return {
      items: items.map((i) => ({ ...i, assignee: i.assignee?.name ?? null })),
      total,
      page,
      pageSize,
    };
  }

  /** 员工：详情（含跟进记录） */
  async detail(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      include: {
        assignee: { select: { name: true } },
        followUps: { orderBy: { createdAt: "desc" }, include: { author: true } },
      },
    });
    if (!inquiry) throw new NotFoundException("询盘不存在");
    return {
      ...inquiry,
      assignee: inquiry.assignee?.name ?? null,
      followUps: inquiry.followUps.map((f) => ({
        id: f.id,
        ts: f.createdAt.toISOString(),
        author: f.author?.name ?? "系统",
        note: f.note,
      })),
    };
  }

  async setStatus(id: string, status: InquiryStatus, operatorId?: string) {
    const exists = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("询盘不存在");
    if (operatorId) await this.logs.log(operatorId, "变更询盘状态", `${exists.id} → ${status}`);
    return this.prisma.inquiry.update({ where: { id }, data: { status } });
  }

  /** 硬删除询盘（跟进记录随 schema 级联清理；SUPER_ADMIN 限定） */
  async remove(id: string, operatorId?: string) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundException("询盘不存在");
    await this.prisma.inquiry.delete({ where: { id } });
    if (operatorId)
      await this.logs.log(operatorId, "删除询盘", `${inquiry.fullName}（${inquiry.company}）`);
    return { ok: true };
  }

  /** 按员工姓名分配（STAFF 列表匹配） */
  async assign(id: string, assigneeName: string, operatorId?: string) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundException("询盘不存在");
    const staff = await this.prisma.staffUser.findFirst({
      where: { name: assigneeName },
    });
    if (operatorId) await this.logs.log(operatorId, "分配询盘", `${inquiry.id} → ${assigneeName}`);
    return this.prisma.inquiry.update({
      where: { id },
      data: { assigneeId: staff?.id ?? null },
    });
  }

  async addFollowUp(id: string, note: string, authorId: string) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) throw new NotFoundException("询盘不存在");
    const followUp = await this.prisma.inquiryFollowUp.create({
      data: { inquiryId: id, note, authorId },
      include: { author: true },
    });
    // 新询盘首次跟进时自动转为“跟进中”
    if (inquiry.status === "NEW") {
      await this.prisma.inquiry.update({ where: { id }, data: { status: "FOLLOWING" } });
    }
    return {
      id: followUp.id,
      ts: followUp.createdAt.toISOString(),
      author: followUp.author?.name ?? "系统",
      note: followUp.note,
    };
  }
}
