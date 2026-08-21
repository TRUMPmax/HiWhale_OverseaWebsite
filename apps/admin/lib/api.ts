import { useAdminAuthStore } from "@/store/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

/** 管理台 API 请求：自动携带 staff token；401 时登出并跳转登录页 */
export async function adminApi<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = useAdminAuthStore.getState().token;
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 401) {
    useAdminAuthStore.getState().logout();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("登录已过期，请重新登录");
  }
  const data = (await res.json().catch(() => ({}))) as { message?: string | string[] };
  if (!res.ok) {
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(message ?? `请求失败（${res.status}）`);
  }
  return data as T;
}

export { API_BASE };
