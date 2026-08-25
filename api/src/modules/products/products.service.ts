import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { OperationLogService } from "../logs/logs.module";
import type { ListProductsDto, UpsertProductDto } from "./dto/products.dto";

/** DB 行 → 前端形状（status 转小写 on/off） */
function toDto(p: Prisma.ProductGetPayload<object>) {
  return { ...p, status: p.status === "ON" ? "on" : "off" };
}

/** 未知结构 JSON 字段（quickSpecs/specGroups/features）安全转 Prisma Json 输入 */
function asJson(value: unknown[] | undefined): Prisma.InputJsonValue {
  return (value ?? []) as Prisma.InputJsonValue;
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logs: OperationLogService,
  ) {}

  async list(query: ListProductsDto, publicOnly: boolean) {
    const { page = 1, pageSize = 20, category, group, search, status } = query;
    const where: Prisma.ProductWhereInput = {
      ...(category ? { category } : {}),
      ...(group ? { group } : {}),
      ...(publicOnly || status === "on"
        ? { status: "ON" as const }
        : status === "off"
          ? { status: "OFF" as const }
          : {}),
      ...(search
        ? {
            OR: [
              { model: { contains: search, mode: "insensitive" as const } },
              { slug: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [total, items] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return { items: items.map(toDto), total, page, pageSize };
  }

  async bySlug(slug: string, publicOnly: boolean) {
    const product = await this.prisma.product.findUnique({ where: { slug } });
    if (!product || (publicOnly && product.status !== "ON")) {
      throw new NotFoundException("产品不存在");
    }
    return toDto(product);
  }

  async create(dto: UpsertProductDto, operatorId?: string) {
    try {
      const product = await this.prisma.product.create({
        data: {
          slug: dto.slug,
          model: dto.model,
          category: dto.category,
          group: dto.group,
          name: dto.name,
          tagline: dto.tagline ?? { en: "", zh: "" },
          description: dto.description ?? { en: "", zh: "" },
          quickSpecs: asJson(dto.quickSpecs),
          specGroups: asJson(dto.specGroups),
          features: asJson(dto.features),
          scenarios: dto.scenarios ?? [],
          imageName: dto.imageName ?? `product-${dto.slug}.png`,
          imageUrl: dto.imageUrl,
          specUrl: dto.specUrl,
          modelUrl: dto.modelUrl,
          imageUrls: dto.imageUrls ?? [],
          status: dto.status === "off" ? "OFF" : "ON",
        },
      });
      if (operatorId) await this.logs.log(operatorId, "新增产品", dto.model);
      return toDto(product);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("slug 或型号已存在");
      }
      throw e;
    }
  }

  async update(id: string, dto: Partial<UpsertProductDto>, operatorId?: string) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("产品不存在");
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          ...(dto.slug !== undefined ? { slug: dto.slug } : {}),
          ...(dto.model !== undefined ? { model: dto.model } : {}),
          ...(dto.category !== undefined ? { category: dto.category } : {}),
          ...(dto.group !== undefined ? { group: dto.group } : {}),
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.tagline !== undefined ? { tagline: dto.tagline } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.quickSpecs !== undefined ? { quickSpecs: asJson(dto.quickSpecs) } : {}),
          ...(dto.specGroups !== undefined ? { specGroups: asJson(dto.specGroups) } : {}),
          ...(dto.features !== undefined ? { features: asJson(dto.features) } : {}),
          ...(dto.scenarios !== undefined ? { scenarios: dto.scenarios } : {}),
          ...(dto.imageName !== undefined ? { imageName: dto.imageName } : {}),
          ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
          ...(dto.specUrl !== undefined ? { specUrl: dto.specUrl } : {}),
          ...(dto.modelUrl !== undefined ? { modelUrl: dto.modelUrl } : {}),
          ...(dto.imageUrls !== undefined ? { imageUrls: dto.imageUrls } : {}),
          ...(dto.status !== undefined
            ? { status: dto.status === "off" ? ("OFF" as const) : ("ON" as const) }
            : {}),
        },
      });
      return toDto(product);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("slug 或型号已存在");
      }
      throw e;
    }
  }

  async setStatus(id: string, status: "on" | "off", operatorId?: string) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("产品不存在");
    const product = await this.prisma.product.update({
      where: { id },
      data: { status: status === "off" ? "OFF" : "ON" },
    });
    if (operatorId)
      await this.logs.log(operatorId, status === "on" ? "上架产品" : "下架产品", product.model);
    return toDto(product);
  }

  async remove(id: string, operatorId?: string) {
    const exists = await this.prisma.product.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("产品不存在");
    await this.prisma.product.delete({ where: { id } });
    if (operatorId) await this.logs.log(operatorId, "删除产品", exists.model);
    return { deleted: true };
  }
}
