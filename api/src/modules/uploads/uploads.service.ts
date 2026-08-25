import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import * as Minio from "minio";

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

  constructor() {
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

  async upload(file: Express.Multer.File, kind: string) {
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

    const month = new Date().toISOString().slice(0, 7);
    const key = `${kind}/${month}/${crypto.randomUUID()}.${ext}`;
    await this.client.putObject(this.bucket, key, file.buffer, file.size, {
      "Content-Type": file.mimetype,
    });
    return { key, url: `${this.publicBase}/${key}` };
  }
}
