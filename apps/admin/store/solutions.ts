import { create } from "zustand";
import { getProductsByCategory, MOCK_SOLUTIONS } from "@hiwhale/shared/constants";
import type { Industry } from "@hiwhale/shared/constants";

export type AdminSolution = {
  id: string;
  titleZh: string;
  titleEn: string;
  industry: Industry;
  summary: string;
  painPoints: string[];
  /** 关联产品 slug 列表 */
  products: string[];
  status: "published" | "draft";
};

type SolutionsState = {
  solutions: AdminSolution[];
  addSolution: (solution: AdminSolution) => void;
  updateSolution: (id: string, patch: Partial<AdminSolution>) => void;
  deleteSolution: (id: string) => void;
  toggleStatus: (id: string) => void;
};

const seed: AdminSolution[] = MOCK_SOLUTIONS.map((s, index) => ({
  id: `sol-${index + 1}`,
  titleZh: s.title.zh,
  titleEn: s.title.en,
  industry: s.industry,
  summary: s.summary.zh,
  painPoints: s.painPoints.map((p) => p.zh),
  products: s.equipment
    .map((c) => getProductsByCategory(c)[0]?.slug)
    .filter((slug): slug is string => Boolean(slug)),
  status: "published",
}));

/** 方案管理 Mock store（会话内 CRUD） */
export const useSolutionsStore = create<SolutionsState>()((set) => ({
  solutions: seed,
  addSolution: (solution) => set((s) => ({ solutions: [solution, ...s.solutions] })),
  updateSolution: (id, patch) =>
    set((s) => ({
      solutions: s.solutions.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  deleteSolution: (id) => set((s) => ({ solutions: s.solutions.filter((item) => item.id !== id) })),
  toggleStatus: (id) =>
    set((s) => ({
      solutions: s.solutions.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "published" ? "draft" : "published" }
          : item,
      ),
    })),
}));
