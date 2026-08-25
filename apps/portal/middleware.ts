import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "./navigation";

/**
 * 按访问者 IP 归属地分配默认语言：中国 IP → 中文，其他 → 英文。
 * 国家代码来源（按优先级）：Vercel 的 x-vercel-ip-country / CDN 或反代注入的 x-country-code；
 * 本地开发或无头信息时回退到 Accept-Language 检测；用户手动切换后由 cookie 记住选择。
 */
export default function middleware(request: NextRequest) {
  const country =
    request.headers.get("x-vercel-ip-country") ?? request.headers.get("x-country-code");
  const geoLocale = country === "CN" ? "zh" : country ? "en" : defaultLocale;

  return createMiddleware({
    locales,
    defaultLocale: geoLocale,
    localePrefix: "always",
    // 有国家代码时严格按 IP 分配（不受浏览器语言影响）；
    // 无国家代码（本地开发等）时回退 Accept-Language 检测
    localeDetection: !country,
  })(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
