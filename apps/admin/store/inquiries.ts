import { create } from "zustand";
import type { InquiryStatus, ProductCategory } from "@hiwhale/shared/constants";
import { adminApi } from "@/lib/api";
import type { MockAdminFollowUp, MockAdminInquiry } from "@/lib/mock/inquiries";

/** API 列表/详情行形状 */
type ApiInquiry = {
  id: string;
  fullName: string;
  company: string;
  country: string;
  email: string;
  phone: string | null;
  categories: string[];
  description: string;
  status: InquiryStatus;
  assignee: string | null;
  createdAt: string;
};

type ApiFollowUp = {
  id: string;
  ts: string;
  author: string;
  note: string;
};

function toRow(i: ApiInquiry): MockAdminInquiry {
  return {
    id: i.id,
    customer: i.fullName,
    company: i.company,
    country: i.country,
    email: i.email,
    phone: i.phone ?? undefined,
    categories: i.categories as ProductCategory[],
    message: i.description,
    status: i.status,
    assignee: i.assignee,
    createdAt: i.createdAt.slice(0, 16).replace("T", " "),
    followUps: [],
  };
}

function toFollowUp(f: ApiFollowUp): MockAdminFollowUp {
  return { ts: f.ts.slice(0, 16).replace("T", " "), author: f.author, note: f.note };
}

type InquiriesState = {
  inquiries: MockAdminInquiry[];
  /** 每个询盘的跟进记录（详情页拉取） */
  details: Record<string, MockAdminFollowUp[]>;
  loading: boolean;
  fetchInquiries: () => Promise<void>;
  fetchDetail: (id: string) => Promise<void>;
  setStatus: (id: string, status: InquiryStatus) => Promise<void>;
  assign: (id: string, assigneeName: string) => Promise<void>;
  addFollowUp: (id: string, note: string) => Promise<void>;
};

/** 询盘管理 store：真实 API 数据层 */
export const useInquiriesStore = create<InquiriesState>()((set, get) => ({
  inquiries: [],
  details: {},
  loading: false,
  fetchInquiries: async () => {
    set({ loading: true });
    try {
      const data = await adminApi<{ items: ApiInquiry[] }>("/api/inquiries?pageSize=100");
      set({ inquiries: data.items.map(toRow) });
    } finally {
      set({ loading: false });
    }
  },
  fetchDetail: async (id) => {
    const detail = await adminApi<ApiInquiry & { followUps: ApiFollowUp[] }>(
      `/api/inquiries/${id}`,
    );
    set((s) => ({
      details: { ...s.details, [id]: detail.followUps.map(toFollowUp) },
      inquiries: s.inquiries.some((i) => i.id === id)
        ? s.inquiries.map((i) => (i.id === id ? toRow(detail) : i))
        : [...s.inquiries, toRow(detail)],
    }));
  },
  setStatus: async (id, status) => {
    await adminApi(`/api/inquiries/${id}/status`, { method: "PATCH", body: { status } });
    await get().fetchInquiries();
  },
  assign: async (id, assigneeName) => {
    await adminApi(`/api/inquiries/${id}/assign`, {
      method: "PATCH",
      body: { assigneeName },
    });
    await get().fetchInquiries();
  },
  addFollowUp: async (id, note) => {
    await adminApi(`/api/inquiries/${id}/follow-ups`, { method: "POST", body: { note } });
    await get().fetchDetail(id);
    await get().fetchInquiries();
  },
}));
