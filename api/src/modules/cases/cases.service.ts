import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { OperationLogService } from "../logs/logs.module";
import type { UpsertCaseDto } from "./dto/cases.dto";

function toDto(c: Prisma.CaseStudyGetPayload<object>) {
  return { ...c, status: c.status === "PUBLISHED" ? "published" : "draft" };
}

function asJson(value: unknown[] | undefined): Prisma.InputJsonValue {
  return (value ?? []) as Prisma.InputJsonValue;
}

@Injectable()
export class CasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logs: OperationLogService,
  ) {}

  async list(publicOnly: boolean) {
    const items = await this.prisma.caseStudy.findMany({
      where: publicOnly ? { status: "PUBLISHED" } : {},
      orderBy: { createdAt: "asc" },
    });
    return { items: items.map(toDto), total: items.length };
  }

  async bySlug(slug: string, publicOnly: boolean) {
    const item = await this.prisma.caseStudy.findUnique({ where: { slug } });
    if (!item || (publicOnly && item.status !== "PUBLISHED")) {
      throw new NotFoundException("案例不存在");
    }
    return toDto(item);
  }

  async create(dto: UpsertCaseDto, operatorId?: string) {
    try {
      const item = await this.prisma.caseStudy.create({
        data: {
          slug: dto.slug,
          industry: dto.industry,
          clientName: dto.clientName,
          project: dto.project,
          background: dto.background ?? { en: "", zh: "" },
          challenge: dto.challenge ?? { en: "", zh: "" },
          solution: dto.solution ?? { en: "", zh: "" },
          equipment: asJson(dto.equipment),
          duration: dto.duration ?? { en: "", zh: "" },
          results: asJson(dto.results),
          testimonial: (dto.testimonial ?? {}) as Prisma.InputJsonValue,
          logoName: dto.logoName ?? `case-logo-${dto.slug}.png`,
          imageName: dto.imageName ?? `case-${dto.slug}.png`,
          status: dto.status === "draft" ? "DRAFT" : "PUBLISHED",
        },
      });
      if (operatorId) await this.logs.log(operatorId, "新增案例", dto.clientName.zh ?? dto.slug);
      return toDto(item);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("slug 已存在");
      }
      throw e;
    }
  }

  async update(id: string, dto: Partial<UpsertCaseDto>, operatorId?: string) {
    const exists = await this.prisma.caseStudy.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("案例不存在");
    try {
      const item = await this.prisma.caseStudy.update({
        where: { id },
        data: {
          ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
          ...(dto.industry !== undefined ? { industry: dto.industry } : {}),
          ...(dto.clientName !== undefined ? { clientName: dto.clientName } : {}),
          ...(dto.project !== undefined ? { project: dto.project } : {}),
          ...(dto.background !== undefined ? { background: dto.background } : {}),
          ...(dto.challenge !== undefined ? { challenge: dto.challenge } : {}),
          ...(dto.solution !== undefined ? { solution: dto.solution } : {}),
          ...(dto.equipment !== undefined ? { equipment: asJson(dto.equipment) } : {}),
          ...(dto.duration !== undefined ? { duration: dto.duration } : {}),
          ...(dto.results !== undefined ? { results: asJson(dto.results) } : {}),
          ...(dto.testimonial !== undefined
            ? { testimonial: dto.testimonial as Prisma.InputJsonValue }
            : {}),
          ...(dto.logoName !== undefined ? { logoName: dto.logoName } : {}),
          ...(dto.imageName !== undefined ? { imageName: dto.imageName } : {}),
          ...(dto.status !== undefined
            ? { status: dto.status === "draft" ? ("DRAFT" as const) : ("PUBLISHED" as const) }
            : {}),
        },
      });
      return toDto(item);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("slug 已存在");
      }
      throw e;
    }
  }

  async setStatus(id: string, status: "published" | "draft", operatorId?: string) {
    const exists = await this.prisma.caseStudy.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("案例不存在");
    const item = await this.prisma.caseStudy.update({
      where: { id },
      data: { status: status === "draft" ? "DRAFT" : "PUBLISHED" },
    });
    return toDto(item);
  }

  async remove(id: string, operatorId?: string) {
    const exists = await this.prisma.caseStudy.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("案例不存在");
    await this.prisma.caseStudy.delete({ where: { id } });
    if (operatorId) await this.logs.log(operatorId, "删除案例", exists.slug);
    return { deleted: true };
  }
}
