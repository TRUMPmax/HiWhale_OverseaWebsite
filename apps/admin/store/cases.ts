import { create } from "zustand";
import { MOCK_CASES } from "@hiwhale/shared/constants";
import type { Industry } from "@hiwhale/shared/constants";

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
  status: "published" | "draft";
};

type CasesState = {
  cases: AdminCase[];
  addCase: (item: AdminCase) => void;
  updateCase: (id: string, patch: Partial<AdminCase>) => void;
  deleteCase: (id: string) => void;
  toggleStatus: (id: string) => void;
};

const seed: AdminCase[] = MOCK_CASES.map((c, index) => ({
  id: `case-${index + 1}`,
  clientName: c.clientName.zh,
  industry: c.industry,
  project: c.project.zh,
  background: c.background.zh,
  challenge: c.challenge.zh,
  solution: c.solution.zh,
  results: c.results.map((r) => ({ value: r.value, label: r.label.zh })),
  testimonial: {
    quote: c.testimonial.quote.zh,
    author: c.testimonial.author.zh,
    role: c.testimonial.role.zh,
  },
  status: "published",
}));

/** 案例管理 Mock store（会话内 CRUD） */
export const useCasesStore = create<CasesState>()((set) => ({
  cases: seed,
  addCase: (item) => set((s) => ({ cases: [item, ...s.cases] })),
  updateCase: (id, patch) =>
    set((s) => ({ cases: s.cases.map((item) => (item.id === id ? { ...item, ...patch } : item)) })),
  deleteCase: (id) => set((s) => ({ cases: s.cases.filter((item) => item.id !== id) })),
  toggleStatus: (id) =>
    set((s) => ({
      cases: s.cases.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "published" ? "draft" : "published" }
          : item,
      ),
    })),
}));
