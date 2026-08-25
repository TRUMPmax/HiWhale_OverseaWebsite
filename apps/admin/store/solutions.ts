import { create } from "zustand";
import { adminApi } from "@/lib/api";

export type AdminSolution = {
  id: string;
  titleZh: string;
  titleEn: string;
  industry: string;
  summary: string;
  painPoints: string[];
  /** 关联产品 slug 列表 */
  products: string[];
  status: "published" | "draft";
};

type ApiSolution = {
  id: string;
  industry: string;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  painPoints: Array<{ en: string; zh: string }>;
  productSlugs: string[];
  status: "published" | "draft";
};

/** API → 页面形状 */
function toRow(s: ApiSolution): AdminSolution {
  return {
    id: s.id,
    titleZh: s.title.zh,
    titleEn: s.title.en,
    industry: s.industry,
    summary: s.summary.zh,
    painPoints: s.painPoints.map((p) => p.zh),
    products: s.productSlugs ?? [],
    status: s.status,
  };
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
      productSlugs: payload.products,
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
