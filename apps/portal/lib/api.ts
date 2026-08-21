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

export { API_BASE };
