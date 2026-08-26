import { create } from "zustand";
import { adminApi } from "@/lib/api";
import type { MockPortalUser } from "@/lib/mock/users";

/** 用户详情（含近期询盘） */
export type AdminUserDetail = MockPortalUser & {
  phone?: string | null;
  recentInquiries: Array<{ id: string; date: string; summary: string; status: string }>;
};

type UsersState = {
  users: MockPortalUser[];
  total: number;
  loading: boolean;
  details: Record<string, AdminUserDetail>;
  fetchUsers: (search?: string) => Promise<void>;
  fetchDetail: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

/** 用户管理 store：真实 API 数据层 */
export const useUsersStore = create<UsersState>()((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  details: {},
  fetchUsers: async (search) => {
    set({ loading: true });
    try {
      const data = await adminApi<{ items: MockPortalUser[]; total: number }>(
        `/api/users?pageSize=100${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      );
      set({ users: data.items, total: data.total });
    } finally {
      set({ loading: false });
    }
  },
  fetchDetail: async (id) => {
    const detail = await adminApi<AdminUserDetail>(`/api/users/${id}`);
    set((s) => ({ details: { ...s.details, [id]: detail } }));
  },
  toggleStatus: async (id) => {
    const user = get().users.find((u) => u.id === id);
    if (!user) return;
    await adminApi(`/api/users/${id}/status`, {
      method: "PATCH",
      body: { status: user.status === "active" ? "disabled" : "active" },
    });
    await get().fetchUsers();
  },
  remove: async (id) => {
    await adminApi(`/api/users/${id}`, { method: "DELETE" });
    await get().fetchUsers();
  },
}));
