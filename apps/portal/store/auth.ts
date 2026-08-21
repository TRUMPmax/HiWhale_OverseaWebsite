import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  name: string;
  email: string;
  company?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (user: AuthUser, token?: string) => void;
  logout: () => void;
};

/** 门户登录态（真实 API + 本地持久化） */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthModalOpen: false,
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      login: (user, token) =>
        set((s) => ({ user, token: token ?? s.token, isAuthModalOpen: false })),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "hiwhale-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
