import { apiGet } from "./api";

/** 获取站点设置值（site_settings KV）；不存在/失败时返回 null（调用方回退默认值） */
export async function fetchSetting<T>(key: string): Promise<T | null> {
  try {
    const data = await apiGet<{ key: string; value: T | null }>(`/api/settings/${key}`);
    return (data.value ?? null) as T | null;
  } catch {
    return null;
  }
}
