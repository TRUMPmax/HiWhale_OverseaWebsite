import { create } from "zustand";
import { adminApi } from "@/lib/api";

/** 中英双语字段 */
export type Pair = { zh: string; en: string };

export type AdminSolution = {
  id: string;
  /** 列表页便捷字段（= title.zh） */
  titleZh: string;
  titleEn: string;
  industry: string;
  summary: Pair;
  description: Pair;
  duration: Pair;
  painPoints: Array<Pair & { icon?: string }>;
  process: Array<{ title: Pair; description: Pair }>;
  results: Array<{ value: string; label: Pair; icon?: string }>;
  /** 关联产品 slug 列表 */
  products: string[];
  status: "published" | "draft";
};

type ApiSolution = {
  id: string;
  industry: string;
  title: Pair;
  summary: Pair;
  description?: Pair;
  duration?: Pair;
  painPoints: Array<Pair | { text?: Pair; icon?: string }>;
  process?: Array<{ title: Pair; description: Pair }>;
  results?: Array<{ value: string; label: Pair; icon?: string }>;
  productSlugs: string[];
  status: "published" | "draft";
};

const emptyPair = (): Pair => ({ zh: "", en: "" });
const pairOf = (p?: Pair): Pair => ({ zh: p?.zh ?? "", en: p?.en ?? "" });

/** API → 页面形状（全字段双语保留） */
function toRow(s: ApiSolution): AdminSolution {
  return {
    id: s.id,
    titleZh: s.title.zh,
    titleEn: s.title.en,
    industry: s.industry,
    summary: s.summary ?? emptyPair(),
    description: s.description ?? emptyPair(),
    duration: pairOf(s.duration),
    painPoints: (s.painPoints ?? []).map((p) => {
      if (p && typeof p === "object" && "text" in p) {
        const obj = p as { text?: Pair; icon?: string };
        return { zh: obj.text?.zh ?? "", en: obj.text?.en ?? "", icon: obj.icon };
      }
      const pair = p as Pair;
      return { zh: pair?.zh ?? "", en: pair?.en ?? "" };
    }),
    process: (s.process ?? []).map((p) => ({
      title: p.title ?? emptyPair(),
      description: p.description ?? emptyPair(),
    })),
    results: (s.results ?? []).map((r) => ({
      value: r.value ?? "",
      label: r.label ?? emptyPair(),
      icon: r.icon,
    })),
    products: s.productSlugs ?? [],
    status: s.status,
  };
}

type SolutionsState = {
  solutions: AdminSolution[];
  loading: boolean;
  fetchSolutions: () => Promise<void>;
  saveSolution: (
    payload: Omit<AdminSolution, "id" | "status" | "titleZh" | "titleEn"> & {
      title: Pair;
    },
    editingId?: string,
  ) => Promise<void>;
  deleteSolution: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
};

/** 方案管理 store：真实 API 数据层（全字段双语，英文不再被中文覆盖） */
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
      title: payload.title,
      summary: payload.summary,
      description: payload.description,
      duration: payload.duration,
      painPoints: payload.painPoints
        .filter((p) => p.zh.trim() || p.en.trim())
        .map((p) => ({ text: { zh: p.zh, en: p.en }, ...(p.icon ? { icon: p.icon } : {}) })),
      process: payload.process.filter((p) => p.title.zh.trim() || p.title.en.trim()),
      results: payload.results
        .filter((r) => r.value.trim() || r.label.zh.trim())
        .map((r) => ({ value: r.value, label: r.label, ...(r.icon ? { icon: r.icon } : {}) })),
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
