import { create } from "zustand";
import { adminApi } from "@/lib/api";

/** 管理台产品记录（与 API 返回形状一致；Json 字段为 {en,zh} 本地化结构） */
export type AdminProduct = {
  id: string;
  slug: string;
  model: string;
  category: string;
  group: string;
  name: { en: string; zh: string };
  tagline: { en: string; zh: string };
  description: { en: string; zh: string };
  quickSpecs: Array<{ label: { en: string; zh: string }; value: { en: string; zh: string } }>;
  specGroups: Array<{
    group: { en: string; zh: string };
    items: Array<{ label: { en: string; zh: string }; value: { en: string; zh: string } }>;
  }>;
  features: Array<{ en: string; zh: string }>;
  scenarios: string[];
  imageName: string;
  imageUrl?: string | null;
  /** 全部已上传图片 URL（主图在前，细节图随后） */
  imageUrls?: string[];
  specUrl?: string | null;
  modelUrl?: string | null;
  status: "on" | "off";
  createdAt: string;
};

/** 新增/编辑提交的载荷 */
export type ProductPayload = Omit<AdminProduct, "id" | "createdAt">;

type ProductsState = {
  products: AdminProduct[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  /** 拖动排序：按 ids 顺序持久化（门户列表按 sort 排序） */
  reorderProducts: (ids: string[]) => Promise<void>;
  addProduct: (payload: ProductPayload) => Promise<void>;
  updateProduct: (id: string, payload: Partial<ProductPayload>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
};

/** 产品管理 store：真实 API 数据层 */
export const useProductsStore = create<ProductsState>()((set, get) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const data = await adminApi<{ items: AdminProduct[] }>("/api/products/admin/all");
      set({ products: data.items });
    } finally {
      set({ loading: false });
    }
  },
  reorderProducts: async (ids) => {
    // 乐观更新本地顺序，再持久化
    const rank = new Map(ids.map((id, i) => [id, i]));
    set((s) => ({
      products: [...s.products].sort((a, b) => (rank.get(a.id) ?? 9999) - (rank.get(b.id) ?? 9999)),
    }));
    await adminApi("/api/products/reorder", { method: "PUT", body: { ids } });
  },
  addProduct: async (payload) => {
    await adminApi("/api/products", { method: "POST", body: payload });
    await get().fetchProducts();
  },
  updateProduct: async (id, payload) => {
    await adminApi(`/api/products/${id}`, { method: "PUT", body: payload });
    await get().fetchProducts();
  },
  deleteProduct: async (id) => {
    await adminApi(`/api/products/${id}`, { method: "DELETE" });
    await get().fetchProducts();
  },
  toggleStatus: async (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    await adminApi(`/api/products/${id}/status`, {
      method: "PATCH",
      body: { status: product.status === "on" ? "off" : "on" },
    });
    await get().fetchProducts();
  },
}));
