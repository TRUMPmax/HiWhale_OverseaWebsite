import { create } from "zustand";
import { UserRole } from "@hiwhale/shared/constants";
import { adminApi } from "@/lib/api";

export type AdminStaff = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "disabled";
  /** 名下询盘数（API _count 展开） */
  assignedInquiries?: number;
};

type StaffState = {
  staff: AdminStaff[];
  loading: boolean;
  fetchStaff: () => Promise<void>;
  addStaff: (item: {
    name: string;
    email: string;
    role: UserRole;
    password: string;
  }) => Promise<void>;
  updateStaff: (id: string, patch: { name?: string; role?: UserRole }) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  deleteStaff: (id: string) => Promise<{ releasedInquiries: number }>;
};

/** 员工管理 store：真实 API 数据层（仅超级管理员可操作） */
export const useStaffStore = create<StaffState>()((set, get) => ({
  staff: [],
  loading: false,
  fetchStaff: async () => {
    set({ loading: true });
    try {
      const raw =
        await adminApi<Array<AdminStaff & { _count?: { assignedInquiries: number } }>>(
          "/api/staff",
        );
      const items = raw.map(({ _count, ...item }) => ({
        ...item,
        assignedInquiries: _count?.assignedInquiries ?? 0,
      }));
      set({ staff: items });
    } finally {
      set({ loading: false });
    }
  },
  addStaff: async (item) => {
    await adminApi("/api/staff", { method: "POST", body: item });
    await get().fetchStaff();
  },
  updateStaff: async (id, patch) => {
    await adminApi(`/api/staff/${id}`, { method: "PUT", body: patch });
    await get().fetchStaff();
  },
  toggleStatus: async (id) => {
    const item = get().staff.find((s) => s.id === id);
    if (!item) return;
    await adminApi(`/api/staff/${id}/status`, {
      method: "PATCH",
      body: { status: item.status === "active" ? "disabled" : "active" },
    });
    await get().fetchStaff();
  },
  deleteStaff: async (id) => {
    const res = await adminApi<{ deleted: boolean; releasedInquiries: number }>(
      `/api/staff/${id}`,
      { method: "DELETE" },
    );
    await get().fetchStaff();
    return { releasedInquiries: res.releasedInquiries };
  },
}));
