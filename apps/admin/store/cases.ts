import { create } from "zustand";
import type { Industry } from "@hiwhale/shared/constants";
import { adminApi } from "@/lib/api";
import type { Pair } from "./solutions";

export type AdminCase = {
  id: string;
  /** 列表页便捷字段（= clientName.zh / project.zh） */
  clientName: string;
  clientNameEn: string;
  industry: Industry | string;
  project: string;
  projectEn: string;
  background: Pair;
  challenge: Pair;
  solution: Pair;
  /** 交付周期 */
  duration: Pair;
  /** 设备清单（文字列表） */
  equipment: Pair[];
  /** 成果数据：值 + 标签 */
  results: Array<{ value: string; label: Pair; icon?: string }>;
  testimonial: { quote: Pair; author: Pair; role: Pair };
  /** 关联产品 slug 列表 */
  products: string[];
  status: "published" | "draft";
};

type ApiCase = {
  id: string;
  industry: Industry;
  clientName: Pair;
  project: Pair;
  background: Pair;
  challenge: Pair;
  solution: Pair;
  duration?: Pair;
  equipment?: Pair[];
  results: Array<{ value: string; label: Pair; icon?: string }>;
  testimonial: { quote?: Pair; author?: Pair; role?: Pair };
  productSlugs?: string[];
  status: "published" | "draft";
};

const emptyPair = (): Pair => ({ zh: "", en: "" });
const pairOf = (p?: Pair): Pair => ({ zh: p?.zh ?? "", en: p?.en ?? "" });

function toRow(c: ApiCase): AdminCase {
  return {
    id: c.id,
    clientName: c.clientName.zh,
    clientNameEn: c.clientName.en,
    industry: c.industry,
    project: c.project.zh,
    projectEn: c.project.en,
    background: pairOf(c.background),
    challenge: pairOf(c.challenge),
    solution: pairOf(c.solution),
    duration: pairOf(c.duration),
    equipment: (c.equipment ?? []).map(pairOf),
    results: (c.results ?? []).map((r) => ({
      value: r.value ?? "",
      label: pairOf(r.label),
      icon: r.icon,
    })),
    testimonial: {
      quote: pairOf(c.testimonial?.quote),
      author: pairOf(c.testimonial?.author),
      role: pairOf(c.testimonial?.role),
    },
    products: c.productSlugs ?? [],
    status: c.status,
  };
}

type CasesState = {
  cases: AdminCase[];
  loading: boolean;
  fetchCases: () => Promise<void>;
  saveCase: (
    payload: Omit<AdminCase, "id" | "status" | "clientName" | "project"> & {
      clientNamePair: Pair;
      projectPair: Pair;
    },
    editingId?: string,
  ) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
};

/** 案例管理 store：真实 API 数据层（全字段双语，含交付周期/设备清单） */
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
      clientName: payload.clientNamePair,
      project: payload.projectPair,
      background: payload.background,
      challenge: payload.challenge,
      solution: payload.solution,
      duration: payload.duration,
      equipment: payload.equipment.filter((e) => e.zh.trim() || e.en.trim()),
      results: payload.results
        .filter((r) => r.value.trim() || r.label.zh.trim())
        .map((r) => ({ value: r.value, label: r.label, ...(r.icon ? { icon: r.icon } : {}) })),
      testimonial: payload.testimonial,
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
