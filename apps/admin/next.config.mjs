import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    // monorepo 根目录：standalone 输出包含 workspace 依赖
    outputFileTracingRoot: path.resolve(dirname, "../.."),
  },
};

export default nextConfig;
