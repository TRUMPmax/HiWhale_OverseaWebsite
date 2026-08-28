/** 解析素材 URL：静态路径（/images/...、/specs/...）补 portal 源前缀；绝对 URL 原样返回 */
export function resolveAssetUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000"}${url}`;
  }
  return url;
}
