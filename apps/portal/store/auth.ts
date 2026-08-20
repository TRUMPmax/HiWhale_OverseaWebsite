import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  name: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (user: AuthUser) => void;
  logout: () => void;
};

/** Mock 登录态（Stage 4）：仅本地持久化，后续接入真实认证 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthModalOpen: false,
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      login: (user) => set({ user, isAuthModalOpen: false }),
      logout: () => set({ user: null }),
    }),
    {
      name: "hiwhale-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
