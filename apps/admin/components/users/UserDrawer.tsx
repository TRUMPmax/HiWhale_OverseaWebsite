"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { MockPortalUser } from "@/lib/mock/users";
import { useUsersStore } from "@/store/users";

type UserDrawerProps = {
  user: MockPortalUser;
  onClose: () => void;
};

/** 用户详情抽屉：右侧滑入（数据来自 API） */
export function UserDrawer({ user, onClose }: UserDrawerProps) {
  const [visible, setVisible] = useState(false);
  const detail = useUsersStore((s) => s.details[user.id]);
  const fetchDetail = useUsersStore((s) => s.fetchDetail);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    void fetchDetail(user.id).catch(() => toast.error("加载详情失败"));
    return () => cancelAnimationFrame(raf);
  }, [user.id, fetchDetail]);

  const close = () => {
    setVisible(false);
    window.setTimeout(onClose, 300);
  };

  const info = detail ?? user;
  const inquiries = detail?.recentInquiries ?? [];

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
                {info.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-slate-900">{info.name}</div>
              <div className="text-xs text-slate-500">{info.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">公司</div>
              <div className="mt-1 font-medium text-slate-900">{info.company ?? "-"}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">国家/地区</div>
              <div className="mt-1 font-medium text-slate-900">{info.country ?? "-"}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">注册时间</div>
              <div className="mt-1 font-medium text-slate-900">{info.registeredAt}</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">AI 对话次数</div>
              <div className="text-brand-blue mt-1 font-medium">{info.aiChatCount}</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">近期询盘</h3>
            <div className="mt-3 space-y-2">
              {inquiries.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 text-sm text-slate-600"
                >
                  <span className="text-xs text-slate-400">{item.date}</span>
                  <span className="min-w-0 flex-1 truncate">{item.summary}</span>
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">{item.status}</Badge>
                </div>
              ))}
              {inquiries.length === 0 && (
                <p className="text-sm text-slate-400">{detail ? "暂无询盘记录" : "加载中…"}</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
