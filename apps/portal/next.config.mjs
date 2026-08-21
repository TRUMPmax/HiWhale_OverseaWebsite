import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    // monorepo 根目录：standalone 输出包含 workspace 依赖
    outputFileTracingRoot: path.resolve(dirname, "../.."),
  },
};

export default withNextIntl(nextConfig);
