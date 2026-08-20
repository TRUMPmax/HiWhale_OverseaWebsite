import { create } from "zustand";
import { MOCK_PRODUCTS } from "@hiwhale/shared/constants";
import type { ProductCategory } from "@hiwhale/shared/constants";

/** 管理台产品记录（列表/表单用精简结构；完整 Mock 数据可按 slug 回溯） */
export type AdminProduct = {
  id: string;
  slug: string;
  /** 中文显示名 */
  name: string;
  model: string;
  category: ProductCategory;
  status: "on" | "off";
  createdAt: string;
  description: string;
};

type ProductsState = {
  products: AdminProduct[];
  addProduct: (product: AdminProduct) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleStatus: (id: string) => void;
};

const seed: AdminProduct[] = MOCK_PRODUCTS.map((p, index) => ({
  id: `p-${index + 1}`,
  slug: p.slug,
  name: p.name.zh,
  model: p.model,
  category: p.category,
  status: "on",
  createdAt: new Date(Date.now() - (index + 3) * 86400000 * 9).toISOString().slice(0, 10),
  description: p.description.zh,
}));

/** 产品管理 Mock  store（会话内 CRUD，后端就绪后替换数据层） */
export const useProductsStore = create<ProductsState>()((set) => ({
  products: seed,
  addProduct: (product) => set((s) => ({ products: [product, ...s.products] })),
  updateProduct: (id, patch) =>
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
  deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
  toggleStatus: (id) =>
    set((s) => ({
      products: s.products.map((p) =>
        p.id === id ? { ...p, status: p.status === "on" ? "off" : "on" } : p,
      ),
    })),
}));
