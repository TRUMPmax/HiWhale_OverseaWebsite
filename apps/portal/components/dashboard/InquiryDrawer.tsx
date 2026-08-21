"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send, X } from "lucide-react";
import {
  getLocalizedLabel,
  INQUIRY_STATUS_LABELS,
  PRODUCT_CATEGORY_LABELS,
} from "@hiwhale/shared/constants";
import { useAuthStore } from "@/store/auth";
import type { MockInquiry, MockInquiryFollowUp } from "./mock-inquiries";

const NOTES_KEY = "hiwhale-inquiry-notes";

const STATUS_BADGE_CLASS: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700",
  FOLLOWING: "bg-amber-50 text-amber-700",
  WON: "bg-green-50 text-green-700",
  CLOSED: "bg-slate-100 text-slate-500",
};

type InquiryDrawerProps = {
  inquiry: MockInquiry;
  onClose: () => void;
};

/** 询盘详情抽屉：右侧滑入，含跟进时间线 + 追加跟进（localStorage 持久化） */
export function InquiryDrawer({ inquiry, onClose }: InquiryDrawerProps) {
  const t = useTranslations("dashboard.inquiries");
  const locale = useLocale();
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);
  const user = useAuthStore((s) => s.user);

  const [visible, setVisible] = useState(false);
  const [notes, setNotes] = useState<Record<string, MockInquiryFollowUp[]>>({});
  const [draft, setDraft] = useState("");

  // 滑入动画 + 读取持久化的追加跟进
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (raw) setNotes(JSON.parse(raw) as Record<string, MockInquiryFollowUp[]>);
    } catch {
      // 损坏数据忽略
    }
    return () => cancelAnimationFrame(raf);
  }, []);

  const close = () => {
    setVisible(false);
    window.setTimeout(onClose, 300);
  };

  const followUps = [...(notes[inquiry.id] ?? []), ...inquiry.followUps].sort(
    (a, b) => +new Date(b.ts) - +new Date(a.ts),
  );

  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    const note: MockInquiryFollowUp = {
      ts: new Date().toISOString(),
      author: { en: user?.name ?? "Me", zh: user?.name ?? "我" },
      note: { en: text, zh: text },
    };
    const next = { ...notes, [inquiry.id]: [note, ...(notes[inquiry.id] ?? [])] };
    setNotes(next);
    localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    setDraft("");
  };

  return (
    <>
      <button
        type="button"
        aria-label={t("close")}
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
        <div className="border-border sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="font-heading text-foreground text-lg font-bold">{t("detailTitle")}</h2>
          <button
            type="button"
            aria-label={t("close")}
            onClick={close}
            className="text-subtle hover:text-foreground rounded-lg p-1.5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {/* 状态 + 日期 + 品类 */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-subtle font-mono text-xs">{inquiry.id}</span>
              <span
                className={`ml-auto rounded-md px-2 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[inquiry.status]}`}
              >
                {getLocalizedLabel(INQUIRY_STATUS_LABELS, inquiry.status, locale)}
              </span>
            </div>
            <p className="text-subtle mt-2 text-xs">
              {t("submittedLabel")}: {inquiry.date}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {inquiry.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                >
                  {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
                </span>
              ))}
            </div>
          </div>

          {/* 需求详情 */}
          <div>
            <h3 className="text-foreground text-sm font-semibold">{t("requirementsLabel")}</h3>
            <p className="text-muted mt-2 text-sm leading-relaxed">{inquiry.details[loc]}</p>
          </div>

          {/* 跟进时间线 */}
          <div>
            <h3 className="text-foreground text-sm font-semibold">{t("followUpTitle")}</h3>
            <div className="relative mt-4">
              <div className="bg-border absolute bottom-2 left-1.5 top-2 w-px" aria-hidden="true" />
              <div className="space-y-5">
                {followUps.map((item, index) => (
                  <div key={`${item.ts}-${index}`} className="relative pl-7">
                    <span className="bg-brand-blue absolute left-1.5 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-2 ring-white" />
                    <div className="text-foreground text-sm font-medium">{item.author[loc]}</div>
                    <div className="text-subtle text-xs">
                      {new Date(item.ts).toLocaleString(locale)}
                    </div>
                    <p className="text-muted mt-1 text-sm leading-relaxed">{item.note[loc]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 追加跟进 */}
          <div>
            <p className="text-subtle mb-1.5 text-xs">{t("localNote")}</p>
            <textarea
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("addNotePlaceholder")}
              className="border-border focus:border-brand-blue w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors"
            />
            <button
              type="button"
              onClick={addNote}
              disabled={!draft.trim()}
              className="bg-brand-blue mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {t("addNoteSubmit")}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
