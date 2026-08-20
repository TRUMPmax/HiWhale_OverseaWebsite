"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bot, CheckCircle2, MessageSquareText, Package, Trash2 } from "lucide-react";
import {
  getLocalizedLabel,
  getProductBySlug,
  INQUIRY_STATUS_LABELS,
  MOCK_PRODUCTS,
  PRODUCT_CATEGORY_LABELS,
} from "@hiwhale/shared/constants";
import { Link, useRouter } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import { MOCK_INQUIRIES } from "./mock-inquiries";

type Tab = "inquiries" | "chat" | "saved" | "profile";

type StoredChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

const STATUS_BADGE_CLASS: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700",
  FOLLOWING: "bg-amber-50 text-amber-700",
  WON: "bg-green-50 text-green-700",
  CLOSED: "bg-slate-100 text-slate-500",
};

const inputClass =
  "border-border focus:border-brand-blue w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors";

/** 控制台：客户端守卫 + 四个标签页 */
export function DashboardClient() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const openChat = useChatStore((s) => s.openChat);

  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("inquiries");
  const [chatMessages, setChatMessages] = useState<StoredChatMessage[]>([]);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
  });

  // 挂载守卫：读取持久化登录态，未登录跳转登录页
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("hiwhale-chat");
      if (raw) setChatMessages(JSON.parse(raw) as StoredChatMessage[]);
    } catch {
      // 损坏数据忽略
    }
    setSavedSlugs(MOCK_PRODUCTS.slice(0, 3).map((p) => p.slug));
  }, []);

  useEffect(() => {
    if (mounted && !user) router.replace("/auth/login");
  }, [mounted, user, router]);

  useEffect(() => {
    if (user) setProfile((p) => ({ ...p, name: user.name, email: user.email }));
  }, [user]);

  // 未挂载或未登录：渲染占位，避免闪烁/水合不一致
  if (!mounted || !user) {
    return <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12" />;
  }

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "inquiries", label: t("tabs.inquiries") },
    { key: "chat", label: t("tabs.chat") },
    { key: "saved", label: t("tabs.saved") },
    { key: "profile", label: t("tabs.profile") },
  ];

  const savedProducts = savedSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p) => p !== undefined);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="flex items-center gap-4">
          <span className="bg-brand-blue flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
              {t("title")}
            </h1>
            <p className="text-muted text-sm">{user.email}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[12rem_1fr]">
          {/* 标签导航：移动端横向，桌面端纵向 */}
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {tabs.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`shrink-0 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  tab === item.key
                    ? "bg-brand-blue text-white"
                    : "text-muted hover:text-foreground hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div>
            {/* 我的询盘 */}
            {tab === "inquiries" && (
              <div className="space-y-4">
                {MOCK_INQUIRIES.map((inquiry) => (
                  <div key={inquiry.id} className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-subtle font-mono text-xs">{inquiry.id}</span>
                      <span className="text-subtle text-xs">{inquiry.date}</span>
                      <span
                        className={`ml-auto rounded-md px-2 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[inquiry.status]}`}
                      >
                        {getLocalizedLabel(INQUIRY_STATUS_LABELS, inquiry.status, locale)}
                      </span>
                    </div>
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
                    <p className="text-muted mt-3 text-sm leading-relaxed">
                      {inquiry.description[loc]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* AI 对话历史 */}
            {tab === "chat" && (
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center gap-4 py-10 text-center">
                    <Bot className="text-subtle h-10 w-10" />
                    <p className="text-muted text-sm">{t("chatHistory.empty")}</p>
                    <button
                      type="button"
                      onClick={openChat}
                      className="bg-brand-blue inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      <MessageSquareText className="h-4 w-4" />
                      {t("chatHistory.openChat")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((message) =>
                      message.role === "system" ? (
                        <p key={message.id} className="text-subtle text-center text-xs">
                          {message.content}
                        </p>
                      ) : (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                              message.role === "user"
                                ? "bg-brand-blue text-white"
                                : "text-foreground bg-blue-50"
                            }`}
                          >
                            <div
                              className={`mb-0.5 text-[0.625rem] ${message.role === "user" ? "text-white/60" : "text-subtle"}`}
                            >
                              {message.role === "user"
                                ? t("chatHistory.you")
                                : t("chatHistory.assistant")}{" "}
                              · {new Date(message.ts).toLocaleString(locale)}
                            </div>
                            {message.content}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 收藏的产品 */}
            {tab === "saved" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedProducts.map((product) => (
                  <div
                    key={product.slug}
                    className="relative rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <button
                      type="button"
                      aria-label={t("saved.remove")}
                      onClick={() =>
                        setSavedSlugs((prev) => prev.filter((s) => s !== product.slug))
                      }
                      className="text-subtle hover:text-foreground absolute right-3 top-3 z-10 rounded-lg bg-white/80 p-1.5 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Placeholder
                      ratio="aspect-[4/3]"
                      className="p-4"
                      label={`${product.name[loc]}产品实拍图`}
                      name={product.imageName}
                    />
                    <h3 className="font-heading text-foreground mt-3 font-bold">
                      {product.name[loc]}
                    </h3>
                    <p className="text-muted mt-1 font-mono text-xs">{product.model}</p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-brand-blue mt-3 inline-block text-sm font-medium hover:underline"
                    >
                      {t("saved.view")} →
                    </Link>
                  </div>
                ))}
                {savedProducts.length === 0 && (
                  <p className="text-muted col-span-full py-10 text-center text-sm">
                    <Package className="mx-auto mb-3 h-8 w-8" />
                    {t("saved.empty")}
                  </p>
                )}
              </div>
            )}

            {/* 个人资料 */}
            {tab === "profile" && (
              <form
                className="max-w-lg rounded-xl border border-slate-200 bg-white p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  login({ name: profile.name, email: user.email });
                  setProfileSaved(true);
                  window.setTimeout(() => setProfileSaved(false), 3000);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-foreground mb-1 block text-sm font-medium">
                      {t("profile.name")}
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={profile.name}
                      onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-sm font-medium">
                      {t("profile.company")}
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={profile.company}
                      onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-foreground mb-1 block text-sm font-medium">
                      {t("profile.email")}
                    </label>
                    <input type="email" className={inputClass} value={profile.email} disabled />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-foreground mb-1 block text-sm font-medium">
                        {t("profile.phone")}
                      </label>
                      <input
                        type="tel"
                        className={inputClass}
                        value={profile.phone}
                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-foreground mb-1 block text-sm font-medium">
                        {t("profile.country")}
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        value={profile.country}
                        onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      className="bg-brand-blue rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      {t("profile.save")}
                    </button>
                    {profileSaved && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        {t("profile.saved")}
                      </span>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
