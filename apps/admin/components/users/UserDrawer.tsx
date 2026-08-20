"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_USER_INQUIRIES, type MockPortalUser } from "@/lib/mock/users";

type UserDrawerProps = {
  user: MockPortalUser;
  onClose: () => void;
};

/** 用户详情抽屉：右侧滑入 */
export function UserDrawer({ user, onClose }: UserDrawerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const close = () => {
    setVisible(false);
    window.setTimeout(onClose, 300);
  };

  const inquiries = MOCK_USER_INQUIRIES[user.id] ?? MOCK_USER_INQUIRIES.default;

  return (
    <>
      <button
        type="button"
        aria-label="关闭"
        onClick={close}
        className={`fixed inset-0 z-[90] bg-black/50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-[95] h-full w-full max-w-md transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">用户详情</h2>
          <button
            type="button"
            aria-label="关闭"
            onClick={close}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-brand-blue text-base font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-slate-900">{user.name}</div>
              <div className="text-xs text-slate-500">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">公司</div>
              <div className="mt-1 font-medium text-slate-900">{user.company}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">国家/地区</div>
              <div className="mt-1 font-medium text-slate-900">{user.country}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">注册时间</div>
              <div className="mt-1 font-medium text-slate-900">{user.registeredAt}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">AI 对话次数</div>
              <div className="text-brand-blue mt-1 font-medium">{user.aiChatCount}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">近期询盘</h3>
            <div className="mt-3 space-y-2">
              {inquiries.map((item) => (
                <div
                  key={item.date}
                  className="rounded-lg border border-slate-100 p-3 text-sm text-slate-600"
                >
                  <span className="mr-2 text-xs text-slate-400">{item.date}</span>
                  {item.summary}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
