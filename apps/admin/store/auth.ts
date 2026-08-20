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
  login: (admin: AdminUser) => void;
  logout: () => void;
};

/** 管理后台 Mock 登录态（Stage 7）：仅本地持久化，后续接入真实认证 */
export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      login: (admin) => set({ admin }),
      logout: () => set({ admin: null }),
    }),
    {
      name: "hiwhale-admin-auth",
      partialize: (state) => ({ admin: state.admin }),
    },
  ),
);
