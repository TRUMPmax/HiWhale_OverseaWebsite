import { create } from "zustand";
import type { InquiryStatus } from "@hiwhale/shared/constants";
import {
  MOCK_ADMIN_INQUIRIES,
  type MockAdminFollowUp,
  type MockAdminInquiry,
} from "@/lib/mock/inquiries";

type InquiriesState = {
  inquiries: MockAdminInquiry[];
  setStatus: (id: string, status: InquiryStatus) => void;
  assign: (id: string, assignee: string | null) => void;
  addFollowUp: (id: string, followUp: MockAdminFollowUp) => void;
};

/** 询盘管理 Mock store（会话内 CRUD，后端就绪后替换数据层） */
export const useInquiriesStore = create<InquiriesState>()((set) => ({
  inquiries: MOCK_ADMIN_INQUIRIES,
  setStatus: (id, status) =>
    set((s) => ({
      inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, status } : i)),
    })),
  assign: (id, assignee) =>
    set((s) => ({
      inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, assignee } : i)),
    })),
  addFollowUp: (id, followUp) =>
    set((s) => ({
      inquiries: s.inquiries.map((i) =>
        i.id === id ? { ...i, followUps: [followUp, ...i.followUps] } : i,
      ),
    })),
}));
