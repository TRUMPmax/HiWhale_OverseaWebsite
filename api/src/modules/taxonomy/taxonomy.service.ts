import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import { OperationLogService } from "../logs/logs.module";
import type { UpsertCategoryDto, UpsertGroupDto } from "./dto/taxonomy.dto";

@Injectable()
export class TaxonomyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logs: OperationLogService,
  ) {}

  /** 公开：完整分类树（按 sort 排序） */
  tree() {
    return this.prisma.productGroupEntity.findMany({
      orderBy: [{ sort: "asc" }, { createdAt: "asc" }],
      include: { categories: { orderBy: [{ sort: "asc" }, { createdAt: "asc" }] } },
    });
  }

  /** 拖动排序：大类按 ids 顺序重写 sort */
  async reorderGroups(ids: string[]) {
    await this.prisma.$transaction(
      ids.map((id, i) =>
        this.prisma.productGroupEntity.update({ where: { id }, data: { sort: i + 1 } }),
      ),
    );
    return { ok: true };
  }

  /** 拖动排序：品类按 ids 顺序重写 sort（同一大类内） */
  async reorderCategories(ids: string[]) {
    await this.prisma.$transaction(
      ids.map((id, i) =>
        this.prisma.productCategoryEntity.update({ where: { id }, data: { sort: i + 1 } }),
      ),
    );
    return { ok: true };
  }

  // ---------- 大类 ----------

  async createGroup(dto: UpsertGroupDto, operatorId: string) {
    try {
      const group = await this.prisma.productGroupEntity.create({
        data: { key: dto.key, nameJson: dto.nameJson, sort: dto.sort ?? 0 },
      });
      await this.logs.log(operatorId, "新增产品大类", dto.nameJson.zh);
      return group;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("key 已存在");
      }
      throw e;
    }
  }

  async updateGroup(id: string, dto: Partial<UpsertGroupDto>, operatorId: string) {
    const exists = await this.prisma.productGroupEntity.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("大类不存在");
    const group = await this.prisma.productGroupEntity.update({
      where: { id },
      data: {
        ...(dto.key !== undefined ? { key: dto.key } : {}),
        ...(dto.nameJson !== undefined ? { nameJson: dto.nameJson } : {}),
        ...(dto.sort !== undefined ? { sort: dto.sort } : {}),
      },
    });
    await this.logs.log(operatorId, "编辑产品大类", group.key);
    return group;
  }

  /**
   * 删除大类：
   * - 下属品类含产品时默认 409（附带 categoryCount / productCount）
   * - ?cascade=true 时级联删除产品、品类、大类
   */
  async deleteGroup(id: string, cascade: boolean, operatorId: string) {
    const group = await this.prisma.productGroupEntity.findUnique({
      where: { id },
      include: { categories: true },
    });
    if (!group) throw new NotFoundException("大类不存在");

    const categoryKeys = group.categories.map((c) => c.key);
    const productCount = await this.prisma.product.count({
      where: { category: { in: categoryKeys } },
    });
    if (productCount > 0 && !cascade) {
      throw new ConflictException({
        statusCode: 409,
        message: `该大类下还有 ${productCount} 个产品（${group.categories.length} 个品类），删除将同时删除这些数据`,
        categoryCount: group.categories.length,
        productCount,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      if (categoryKeys.length > 0) {
        await tx.product.deleteMany({ where: { category: { in: categoryKeys } } });
        await tx.productCategoryEntity.deleteMany({ where: { groupId: id } });
      }
      await tx.productGroupEntity.delete({ where: { id } });
    });
    await this.logs.log(operatorId, "删除产品大类", `${group.key}（级联=${cascade}）`);
    return { deleted: true, cascadeDeleted: productCount };
  }

  // ---------- 品类 ----------

  async createCategory(dto: UpsertCategoryDto, operatorId: string) {
    const group = await this.prisma.productGroupEntity.findUnique({
      where: { id: dto.groupId },
    });
    if (!group) throw new BadRequestException("所属大类不存在");
    try {
      const category = await this.prisma.productCategoryEntity.create({
        data: { key: dto.key, groupId: dto.groupId, nameJson: dto.nameJson, sort: dto.sort ?? 0 },
      });
      await this.logs.log(operatorId, "新增产品品类", dto.nameJson.zh);
      return category;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("key 已存在");
      }
      throw e;
    }
  }

  async updateCategory(id: string, dto: Partial<UpsertCategoryDto>, operatorId: string) {
    const exists = await this.prisma.productCategoryEntity.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException("品类不存在");
    if (dto.groupId) {
      const group = await this.prisma.productGroupEntity.findUnique({
        where: { id: dto.groupId },
      });
      if (!group) throw new BadRequestException("所属大类不存在");
    }
    const category = await this.prisma.productCategoryEntity.update({
      where: { id },
      data: {
        ...(dto.key !== undefined ? { key: dto.key } : {}),
        ...(dto.groupId !== undefined ? { groupId: dto.groupId } : {}),
        ...(dto.nameJson !== undefined ? { nameJson: dto.nameJson } : {}),
        ...(dto.sort !== undefined ? { sort: dto.sort } : {}),
      },
    });
    await this.logs.log(operatorId, "编辑产品品类", dto.key ?? id);
    return category;
  }

  /**
   * 删除品类：存在产品时默认 409（附带 productCount）；?cascade=true 级联删除产品
   */
  async deleteCategory(id: string, cascade: boolean, operatorId: string) {
    const category = await this.prisma.productCategoryEntity.findUnique({ where: { id } });
    if (!category) throw new NotFoundException("品类不存在");

    const productCount = await this.prisma.product.count({
      where: { category: category.key },
    });
    if (productCount > 0 && !cascade) {
      throw new ConflictException({
        statusCode: 409,
        message: `该品类下还有 ${productCount} 个产品，删除品类将同时删除这些产品`,
        productCount,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      if (productCount > 0) await tx.product.deleteMany({ where: { category: category.key } });
      await tx.productCategoryEntity.delete({ where: { id } });
    });
    await this.logs.log(operatorId, "删除产品品类", `${category.key}（级联=${cascade}）`);
    return { deleted: true, cascadeDeleted: productCount };
  }
}
