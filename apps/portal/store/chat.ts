import { create } from "zustand";

type ChatState = {
  isChatOpen: boolean;
  /** 由 AskAIButton 设置的产品上下文（打开聊天窗时消费一次） */
  productContext: string | null;
  openChat: () => void;
  closeChat: () => void;
  setProductContext: (name: string | null) => void;
};

/** AI 聊天窗状态（不持久化；消息历史由组件自行写入 localStorage） */
export const useChatStore = create<ChatState>()((set) => ({
  isChatOpen: false,
  productContext: null,
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  setProductContext: (name) => set({ productContext: name }),
}));
