/** 门户 API 客户端（极简封装；后端就绪前所有调用均可失败降级为错误提示） */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ApiError = Error & { status?: number };

/** POST 请求；非 2xx 时抛出携带后端 message 的错误 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { message?: string | string[] };
  if (!res.ok) {
    const err = new Error(
      (Array.isArray(data.message) ? data.message[0] : data.message) ??
        `Request failed (${res.status})`,
    ) as ApiError;
    err.status = res.status;
    throw err;
  }
  return data as T;
}

/** GET 请求（服务端/客户端通用；不缓存，实时数据）；可选 Bearer token */
export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`) as ApiError;
    err.status = res.status;
    throw err;
  }
  return (await res.json()) as T;
}

export { API_BASE };
