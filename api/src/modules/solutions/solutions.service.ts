import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { OperationLogService } from "../logs/logs.module";
import type { UpsertSolutionDto } from "./dto/solutions.dto";

function toDto(s: Prisma.SolutionGetPayload<object>) {
  return { ...s, status: s.status === "PUBLISHED" ? "published" : "draft" };
}

function asJson(value: unknown[] | undefined): Prisma.InputJsonValue {
  return (value ?? []) as Prisma.InputJsonValue;
}

@Injectable()
export class SolutionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logs: OperationLogService,
  ) {}

  async list(publicOnly: boolean) {
    const items = await this.prisma.solution.findMany({
      where: publicOnly ? { status: "PUBLISHED" } : {},
      orderBy: { createdAt: "asc" },
    });
    return { items: items.map(toDto), total: items.length };
  }

  async bySlug(slug: string, publicOnly: boolean) {
    const solution = await this.prisma.solution.findUnique({ where: { slug } });
    if (!solution || (publicOnly && solution.status !== "PUBLISHED")) {
      throw new NotFoundException("方案不存在");
    }
    return toDto(solution);
  }

  async create(dto: UpsertSolutionDto, operatorId?: string) {
    try {
      const solution = await this.prisma.solution.create({
        data: {
          slug: dto.slug,
          industry: dto.industry,
          title: dto.title,
          summary: dto.summary ?? { en: "", zh: "" },
          description: dto.description ?? { en: "", zh: "" },
          painPoints: asJson(dto.painPoints),
          productSlugs: dto.productSlugs ?? [],
          process: asJson(dto.process),
          results: asJson(dto.results),
          imageName: dto.imageName ?? `solution-${dto.slug}.png`,
          status: dto.status === "draft" ? "DRAFT" : "PUBLISHED",
        },
      });
      if (operatorId) await this.logs.log(operatorId, "新增方案", dto.title.zh ?? dto.slug);
      return toDto(solution);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("slug 已存在");
      }
      throw e;
    }
  }

  async update(id: string, dto: Partial<UpsertSolutionDto>, operatorId?: string) {
    const exists = await this.prisma.solution.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("方案不存在");
    try {
      const solution = await this.prisma.solution.update({
        where: { id },
        data: {
          ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
          ...(dto.industry !== undefined ? { industry: dto.industry } : {}),
          ...(dto.title !== undefined ? { title: dto.title } : {}),
          ...(dto.summary !== undefined ? { summary: dto.summary } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.painPoints !== undefined ? { painPoints: asJson(dto.painPoints) } : {}),
          ...(dto.productSlugs !== undefined ? { productSlugs: dto.productSlugs } : {}),
          ...(dto.process !== undefined ? { process: asJson(dto.process) } : {}),
          ...(dto.results !== undefined ? { results: asJson(dto.results) } : {}),
          ...(dto.imageName !== undefined ? { imageName: dto.imageName } : {}),
          ...(dto.status !== undefined
            ? { status: dto.status === "draft" ? ("DRAFT" as const) : ("PUBLISHED" as const) }
            : {}),
        },
      });
      return toDto(solution);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("slug 已存在");
      }
      throw e;
    }
  }

  async setStatus(id: string, status: "published" | "draft", operatorId?: string) {
    const exists = await this.prisma.solution.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("方案不存在");
    const solution = await this.prisma.solution.update({
      where: { id },
      data: { status: status === "draft" ? "DRAFT" : "PUBLISHED" },
    });
    return toDto(solution);
  }

  async remove(id: string, operatorId?: string) {
    const exists = await this.prisma.solution.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("方案不存在");
    await this.prisma.solution.delete({ where: { id } });
    if (operatorId) await this.logs.log(operatorId, "删除方案", exists.slug);
    return { deleted: true };
  }
}
