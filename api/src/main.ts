import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
