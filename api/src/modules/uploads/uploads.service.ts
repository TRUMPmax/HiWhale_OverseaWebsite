import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  ServiceUnavailableException,
} from "@nestjs/common";
import * as Minio from "minio";
import { CopyDestinationOptions, CopySourceOptions } from "minio";
import * as fs from "node:fs";
import * as path from "node:path";
import { PrismaService } from "../../common/prisma/prisma.service";
import { ASSET_SLOTS, buildDynamicSlots, type AssetSlot } from "./asset-slots";

const KIND_RULES: Record<string, { mimes: string[]; maxSize: number; label: string }> = {
  image: {
    mimes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    maxSize: 5 * 1024 * 1024,
    label: "图片",
  },
  spec: {
    mimes: ["application/pdf"],
    maxSize: 100 * 1024 * 1024,
    label: "规格书 PDF",
  },
  model: {
    mimes: ["model/gltf-binary", "model/gltf+json", "application/octet-stream"],
    maxSize: 50 * 1024 * 1024,
    label: "3D 模型",
  },
  doc: {
    mimes: [
      "application/pdf",
      "text/markdown",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/octet-stream",
    ],
    maxSize: 20 * 1024 * 1024,
    label: "知识库文档",
  },
};

@Injectable()
export class UploadsService implements OnModuleInit {
  private client: Minio.Client;
  private bucket = process.env.MINIO_BUCKET ?? "hiwhale-uploads";
  private publicBase = process.env.MINIO_PUBLIC_URL ?? `http://localhost:9000/${this.bucket}`;

  constructor(private readonly prisma: PrismaService) {
    this.client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT ?? "localhost",
      port: Number(process.env.MINIO_PORT ?? 9000),
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY ?? "hiwhale",
      secretKey: process.env.MINIO_SECRET_KEY ?? "hiwhale_dev",
    });
  }

  /** 启动时确保 bucket 存在（幂等） */
  async onModuleInit() {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) await this.client.makeBucket(this.bucket);
    } catch {
      console.warn("[uploads] MinIO not reachable at startup");
    }
  }

  async upload(file: Express.Multer.File, kind: string, targetKey?: string) {
    const rule = KIND_RULES[kind];
    if (!rule) throw new BadRequestException("kind 必须为 image / spec / model / doc");
    if (!file) throw new BadRequestException("请选择文件");

    const ext = file.originalname.split(".").pop()?.toLowerCase() ?? "";
    const mimeOk =
      rule.mimes.includes(file.mimetype) ||
      (kind === "model" && ["glb", "gltf"].includes(ext)) ||
      (kind === "doc" && ["pdf", "md", "txt", "docx"].includes(ext));
    if (!mimeOk) {
      throw new BadRequestException(`${rule.label}格式不支持（${file.mimetype || ext}）`);
    }
    if (file.size > rule.maxSize) {
      throw new BadRequestException(
        `${rule.label}超出大小限制（${Math.round(rule.maxSize / 1024 / 1024)}MB）`,
      );
    }

    // 指定 key 时覆盖原对象（替换文件，URL 引用保持不变）
    const month = new Date().toISOString().slice(0, 7);
    const key = targetKey ?? `${kind}/${month}/${crypto.randomUUID()}.${ext}`;
    await this.client.putObject(this.bucket, key, file.buffer, file.size, {
      "Content-Type": file.mimetype,
    });
    return { key, url: `${this.publicBase}/${key}` };
  }

  /** 列出 bucket 对象（分页 + 可选前缀过滤） */
  async listObjects(page: number, pageSize: number, prefix?: string) {
    const objects: Array<{
      key: string;
      url: string;
      size: number;
      lastModified: string;
      kind: string;
    }> = [];
    const stream = this.client.listObjects(this.bucket, prefix ?? "", true);
    for await (const obj of stream) {
      if (!obj.name) continue;
      objects.push({
        key: obj.name,
        url: `${this.publicBase}/${obj.name}`,
        size: obj.size ?? 0,
        lastModified: (obj.lastModified ?? new Date(0)).toISOString(),
        kind: obj.name.split("/")[0] ?? "other",
      });
    }
    // 最新在前
    objects.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    const start = (page - 1) * pageSize;
    return {
      items: objects.slice(start, start + pageSize),
      total: objects.length,
      page,
      pageSize,
    };
  }

  /** 删除 MinIO 对象；不存在时返回 null */
  async deleteObject(key: string) {
    try {
      await this.client.statObject(this.bucket, key);
    } catch {
      return null;
    }
    await this.client.removeObject(this.bucket, key);
    return { deleted: true, key };
  }

  /** 文件名规范化：小写字母/数字/中划线 + 保留扩展名 */
  private sanitizeFileName(name: string, fallbackExt: string): string {
    const clean = name
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!clean) throw new BadRequestException("文件名无效");
    return `${clean}.${fallbackExt}`;
  }

  /**
   * 重命名对象：复制到新 key → 删除旧 key → 更新数据库引用
   * （products.imageUrl / imageUrls[] / specUrl / modelUrl, knowledge_documents.fileUrl）
   */
  async renameObject(key: string, newFileName: string) {
    // 校验旧对象存在
    try {
      await this.client.statObject(this.bucket, key);
    } catch {
      throw new NotFoundException("原文件不存在");
    }

    const dir = key.split("/").slice(0, -1).join("/");
    const ext = key.split(".").pop()?.toLowerCase() ?? "";
    const newKey = `${dir}/${this.sanitizeFileName(newFileName.replace(/\.[^.]+$/, ""), ext)}`;
    if (newKey === key) throw new BadRequestException("新文件名与原文件名相同");

    // 新 key 冲突检查
    try {
      await this.client.statObject(this.bucket, newKey);
      throw new ConflictException("目标文件名已存在");
    } catch (e) {
      if (e instanceof ConflictException) throw e;
    }

    await this.client.copyObject(
      new CopySourceOptions({ Bucket: this.bucket, Object: key }),
      new CopyDestinationOptions({ Bucket: this.bucket, Object: newKey }),
    );
    await this.client.removeObject(this.bucket, key);

    // 更新数据库引用
    const oldUrl = `${this.publicBase}/${key}`;
    const newUrl = `${this.publicBase}/${newKey}`;
    let updatedRefs = 0;

    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { imageUrl: oldUrl },
          { specUrl: oldUrl },
          { modelUrl: oldUrl },
          { imageUrls: { string_contains: oldUrl } },
        ],
      },
    });
    for (const p of products) {
      const urls = Array.isArray(p.imageUrls) ? (p.imageUrls as string[]) : [];
      await this.prisma.product.update({
        where: { id: p.id },
        data: {
          imageUrl: p.imageUrl === oldUrl ? newUrl : p.imageUrl,
          specUrl: p.specUrl === oldUrl ? newUrl : p.specUrl,
          modelUrl: p.modelUrl === oldUrl ? newUrl : p.modelUrl,
          imageUrls: urls.map((u) => (u === oldUrl ? newUrl : u)),
        },
      });
      updatedRefs++;
    }

    const docs = await this.prisma.knowledgeDocument.updateMany({
      where: { fileUrl: oldUrl },
      data: { fileUrl: newUrl },
    });
    updatedRefs += docs.count;

    return { key: newKey, url: newUrl, updatedRefs };
  }

  // ---------- 站点素材位（写入门户 public/images） ----------

  private portalPublicDir() {
    return process.env.PORTAL_PUBLIC_DIR ?? path.resolve(process.cwd(), "../apps/portal/public");
  }

  private slotPath(slot: AssetSlot) {
    return path.join(this.portalPublicDir(), "images", slot.subdir, slot.filename);
  }

  /** 全量素材位 = 静态注册表 + DB 动态槽（方案/案例） */
  private async allSlots(): Promise<AssetSlot[]> {
    const [solutions, cases] = await Promise.all([
      this.prisma.solution.findMany({ select: { slug: true, title: true, imageName: true } }),
      this.prisma.caseStudy.findMany({
        select: { slug: true, clientName: true, imageName: true, logoName: true },
      }),
    ]);
    return [...ASSET_SLOTS, ...buildDynamicSlots(solutions, cases)];
  }

  /** 素材位列表（含存在状态与文件大小） */
  async listSiteAssets() {
    const slots = await this.allSlots();
    return slots.map((slot) => {
      let exists = false;
      let size = 0;
      try {
        const stat = fs.statSync(this.slotPath(slot));
        exists = stat.isFile();
        size = stat.size;
      } catch {
        // 缺失
      }
      return { ...slot, exists, size };
    });
  }

  /** 素材位扩展名校验规则 */
  private static SITE_ASSET_RULES: Record<string, { mimes: string[]; maxSize: number }> = {
    ".png": { mimes: ["image/png"], maxSize: 5 * 1024 * 1024 },
    ".jpg": { mimes: ["image/jpeg"], maxSize: 5 * 1024 * 1024 },
    ".jpeg": { mimes: ["image/jpeg"], maxSize: 5 * 1024 * 1024 },
    ".webp": { mimes: ["image/webp"], maxSize: 5 * 1024 * 1024 },
    ".svg": { mimes: ["image/svg+xml"], maxSize: 1 * 1024 * 1024 },
    ".mp4": { mimes: ["video/mp4"], maxSize: 100 * 1024 * 1024 },
    ".glb": { mimes: ["model/gltf-binary", "application/octet-stream"], maxSize: 50 * 1024 * 1024 },
  };

  /** 上传/替换素材位文件 */
  async saveSiteAsset(slotId: string, file: Express.Multer.File) {
    const slot = (await this.allSlots()).find((s) => s.id === slotId);
    if (!slot) throw new NotFoundException("素材位不存在");
    if (!file) throw new BadRequestException("请选择文件");
    const ext = path.extname(slot.filename).toLowerCase();
    const rule = UploadsService.SITE_ASSET_RULES[ext];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!rule || fileExt !== ext || !rule.mimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `文件类型不符：需 ${ext}（${rule?.mimes.join("/") ?? "不支持"}）`,
      );
    }
    if (file.size > rule.maxSize) {
      throw new BadRequestException(
        `文件超出大小限制（${Math.round(rule.maxSize / 1024 / 1024)}MB）`,
      );
    }
    const target = this.slotPath(slot);
    try {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.buffer);
    } catch {
      throw new ServiceUnavailableException(
        "素材位目录不可写（生产环境请检查 PORTAL_PUBLIC_DIR 卷挂载）",
      );
    }
    return { ok: true, path: `/images/${slot.subdir}/${slot.filename}` };
  }

  /** 删除素材位文件（回到"缺失"状态） */
  async deleteSiteAsset(slotId: string) {
    const slot = (await this.allSlots()).find((s) => s.id === slotId);
    if (!slot) throw new NotFoundException("素材位不存在");
    try {
      fs.unlinkSync(this.slotPath(slot));
    } catch {
      return null;
    }
    return { deleted: true };
  }
}
