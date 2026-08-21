import { create } from "zustand";
import { MOCK_PRODUCTS } from "@hiwhale/shared/constants";
import type { Industry, ProductCategory } from "@hiwhale/shared/constants";
import { adminApi } from "@/lib/api";

export type AdminSolution = {
  id: string;
  titleZh: string;
  titleEn: string;
  industry: Industry;
  summary: string;
  painPoints: string[];
  /** 关联产品 slug 列表（UI 层；API 存的是品类，边界处转换） */
  products: string[];
  status: "published" | "draft";
};

type ApiSolution = {
  id: string;
  industry: Industry;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  painPoints: Array<{ en: string; zh: string }>;
  equipment: string[];
  status: "published" | "draft";
};

/** API → 页面形状：品类 → 该品类第一款产品的 slug */
function toRow(s: ApiSolution): AdminSolution {
  return {
    id: s.id,
    titleZh: s.title.zh,
    titleEn: s.title.en,
    industry: s.industry,
    summary: s.summary.zh,
    painPoints: s.painPoints.map((p) => p.zh),
    products: s.equipment
      .map((c) => MOCK_PRODUCTS.find((p) => p.category === c)?.slug)
      .filter((slug): slug is string => Boolean(slug)),
    status: s.status,
  };
}

/** 页面 → API：产品 slug → 品类（去重） */
function toEquipment(products: string[]): string[] {
  const categories = products
    .map((slug) => MOCK_PRODUCTS.find((p) => p.slug === slug)?.category)
    .filter((c): c is ProductCategory => Boolean(c));
  return Array.from(new Set(categories));
}

type SolutionsState = {
  solutions: AdminSolution[];
  loading: boolean;
  fetchSolutions: () => Promise<void>;
  saveSolution: (
    payload: Omit<AdminSolution, "id" | "status">,
    editingId?: string,
  ) => Promise<void>;
  deleteSolution: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
};

/** 方案管理 store：真实 API 数据层 */
export const useSolutionsStore = create<SolutionsState>()((set, get) => ({
  solutions: [],
  loading: false,
  fetchSolutions: async () => {
    set({ loading: true });
    try {
      const data = await adminApi<{ items: ApiSolution[] }>("/api/solutions/admin/all");
      set({ solutions: data.items.map(toRow) });
    } finally {
      set({ loading: false });
    }
  },
  saveSolution: async (payload, editingId) => {
    const body = {
      slug: editingId ? undefined : `solution-${Date.now()}`,
      industry: payload.industry,
      title: { zh: payload.titleZh, en: payload.titleEn },
      summary: { zh: payload.summary, en: payload.summary },
      painPoints: payload.painPoints.map((p) => ({ zh: p, en: p })),
      equipment: toEquipment(payload.products),
      status: editingId ? undefined : "draft",
    };
    if (editingId) {
      const { slug: _slug, status: _status, ...updateBody } = body;
      await adminApi(`/api/solutions/${editingId}`, { method: "PUT", body: updateBody });
    } else {
      await adminApi("/api/solutions", { method: "POST", body });
    }
    await get().fetchSolutions();
  },
  deleteSolution: async (id) => {
    await adminApi(`/api/solutions/${id}`, { method: "DELETE" });
    await get().fetchSolutions();
  },
  toggleStatus: async (id) => {
    const item = get().solutions.find((s) => s.id === id);
    if (!item) return;
    await adminApi(`/api/solutions/${id}/status`, {
      method: "PATCH",
      body: { status: item.status === "published" ? "draft" : "published" },
    });
    await get().fetchSolutions();
  },
}));
