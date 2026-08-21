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
  quickSpecs: Array<{ label: { en: string; zh: string }; value: string }>;
  specGroups: Array<{
    group: { en: string; zh: string };
    items: Array<{ label: { en: string; zh: string }; value: string }>;
  }>;
  features: Array<{ en: string; zh: string }>;
  scenarios: string[];
  imageName: string;
  status: "on" | "off";
  createdAt: string;
};

/** 新增/编辑提交的载荷 */
export type ProductPayload = Omit<AdminProduct, "id" | "createdAt">;

type ProductsState = {
  products: AdminProduct[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
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
