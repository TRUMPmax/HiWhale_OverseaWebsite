import { create } from "zustand";
import type { Industry } from "@hiwhale/shared/constants";
import { adminApi } from "@/lib/api";

export type AdminCase = {
  id: string;
  clientName: string;
  industry: Industry;
  project: string;
  background: string;
  challenge: string;
  solution: string;
  /** 成果数据：值 + 标签 */
  results: Array<{ value: string; label: string }>;
  testimonial: { quote: string; author: string; role: string };
  /** 关联产品 slug 列表 */
  products: string[];
  status: "published" | "draft";
};

type ApiCase = {
  id: string;
  industry: Industry;
  clientName: { en: string; zh: string };
  project: { en: string; zh: string };
  background: { en: string; zh: string };
  challenge: { en: string; zh: string };
  solution: { en: string; zh: string };
  results: Array<{ value: string; label: { en: string; zh: string } }>;
  testimonial: {
    quote?: { en: string; zh: string };
    author?: { en: string; zh: string };
    role?: { en: string; zh: string };
  };
  productSlugs?: string[];
  status: "published" | "draft";
};

function toRow(c: ApiCase): AdminCase {
  return {
    id: c.id,
    clientName: c.clientName.zh,
    industry: c.industry,
    project: c.project.zh,
    background: c.background.zh,
    challenge: c.challenge.zh,
    solution: c.solution.zh,
    results: c.results.map((r) => ({ value: r.value, label: r.label.zh })),
    testimonial: {
      quote: c.testimonial.quote?.zh ?? "",
      author: c.testimonial.author?.zh ?? "",
      role: c.testimonial.role?.zh ?? "",
    },
    products: c.productSlugs ?? [],
    status: c.status,
  };
}

/** 单语（中文）→ {en, zh} */
const both = (v: string) => ({ zh: v, en: v });

type CasesState = {
  cases: AdminCase[];
  loading: boolean;
  fetchCases: () => Promise<void>;
  saveCase: (payload: Omit<AdminCase, "id" | "status">, editingId?: string) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
};

/** 案例管理 store：真实 API 数据层 */
export const useCasesStore = create<CasesState>()((set, get) => ({
  cases: [],
  loading: false,
  fetchCases: async () => {
    set({ loading: true });
    try {
      const data = await adminApi<{ items: ApiCase[] }>("/api/cases/admin/all");
      set({ cases: data.items.map(toRow) });
    } finally {
      set({ loading: false });
    }
  },
  saveCase: async (payload, editingId) => {
    const body = {
      slug: editingId ? undefined : `case-${Date.now()}`,
      industry: payload.industry,
      clientName: both(payload.clientName),
      project: both(payload.project),
      background: both(payload.background),
      challenge: both(payload.challenge),
      solution: both(payload.solution),
      results: payload.results.map((r) => ({ value: r.value, label: both(r.label) })),
      testimonial: {
        quote: both(payload.testimonial.quote),
        author: both(payload.testimonial.author),
        role: both(payload.testimonial.role),
      },
      productSlugs: payload.products,
      status: editingId ? undefined : "draft",
    };
    if (editingId) {
      const { slug: _slug, status: _status, ...updateBody } = body;
      await adminApi(`/api/cases/${editingId}`, { method: "PUT", body: updateBody });
    } else {
      await adminApi("/api/cases", { method: "POST", body });
    }
    await get().fetchCases();
  },
  deleteCase: async (id) => {
    await adminApi(`/api/cases/${id}`, { method: "DELETE" });
    await get().fetchCases();
  },
  toggleStatus: async (id) => {
    const item = get().cases.find((c) => c.id === id);
    if (!item) return;
    await adminApi(`/api/cases/${id}/status`, {
      method: "PATCH",
      body: { status: item.status === "published" ? "draft" : "published" },
    });
    await get().fetchCases();
  },
}));
