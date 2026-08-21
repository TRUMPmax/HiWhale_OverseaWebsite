/**
 * MinIO 初始化：创建 bucket + 公开读策略（图片直链）
 * 用法：node scripts/init-minio.js（读取 api/.env）
 */
const Minio = require("minio");

const endpoint = process.env.MINIO_ENDPOINT ?? "localhost";
const port = Number(process.env.MINIO_PORT ?? 9000);
const bucket = process.env.MINIO_BUCKET ?? "hiwhale-uploads";

const client = new Minio.Client({
  endPoint: endpoint,
  port,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY ?? "hiwhale",
  secretKey: process.env.MINIO_SECRET_KEY ?? "hiwhale_dev",
});

async function main() {
  const exists = await client.bucketExists(bucket);
  if (!exists) {
    await client.makeBucket(bucket);
    console.log(`[minio] bucket created: ${bucket}`);
  } else {
    console.log(`[minio] bucket exists: ${bucket}`);
  }

  // 公开只读策略（/images 等静态素材直链）
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  };
  await client.setBucketPolicy(bucket, JSON.stringify(policy));
  console.log(`[minio] public-read policy set on: ${bucket}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
