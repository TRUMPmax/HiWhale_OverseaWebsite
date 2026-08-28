import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { json, urlencoded } from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 大文本内容导入（FAQ CSV 等）需要更大的 body 上限（默认 100KB 不够）
  app.use(json({ limit: "2mb" }));
  app.use(urlencoded({ limit: "2mb", extended: true }));

  // 全局前缀 /api；健康检查保持在根路径（供 Docker healthcheck 使用）
  app.setGlobalPrefix("api", { exclude: ["health", "health/db"] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:3001").split(","),
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, "0.0.0.0");
  console.log(`[api] listening on :${port}`);
}

void bootstrap();
