import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@hiwhale/shared/constants";

export type AdminUser = {
  name: string;
  email: string;
  role: UserRole;
};

type AdminAuthState = {
  admin: AdminUser | null;
  token: string | null;
  login: (admin: AdminUser, token: string) => void;
  logout: () => void;
};

/** 管理后台登录态（真实 API + 本地持久化） */
export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      login: (admin, token) => set({ admin, token }),
      logout: () => set({ admin: null, token: null }),
    }),
    {
      name: "hiwhale-admin-auth",
      partialize: (state) => ({ admin: state.admin, token: state.token }),
    },
  ),
);
