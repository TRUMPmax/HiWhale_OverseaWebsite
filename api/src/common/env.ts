/** JWT 密钥：生产环境必须显式配置（缺失即拒绝启动），开发环境允许兜底 */
export function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production (set it in the server .env)");
  }
  return "dev-secret-change-me";
}
