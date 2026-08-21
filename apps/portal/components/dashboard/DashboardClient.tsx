"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bot, CheckCircle2, ChevronRight, MessageSquareText, Package, Trash2 } from "lucide-react";
import {
  getLocalizedLabel,
  getProductBySlug,
  INQUIRY_STATUS_LABELS,
  MOCK_PRODUCTS,
  PRODUCT_CATEGORY_LABELS,
} from "@hiwhale/shared/constants";
import { Link, useRouter } from "@/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import { Placeholder } from "@/components/ui/Placeholder";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import { MOCK_INQUIRIES, type MockInquiry } from "./mock-inquiries";
import { ChatHistoryViewer, type StoredChatMessage } from "./ChatHistoryViewer";
import { InquiryDrawer } from "./InquiryDrawer";

type Tab = "inquiries" | "chat" | "saved" | "profile";

type SavedItem = {
  slug: string;
  savedAt: string;
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
  const token = useAuthStore((s) => s.token);
  const login = useAuthStore((s) => s.login);
  const openChat = useChatStore((s) => s.openChat);

  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("inquiries");
  const [chatMessages, setChatMessages] = useState<StoredChatMessage[]>([]);
  const [conversations, setConversations] = useState<
    Array<{
      id: string;
      productModel: string | null;
      updatedAt: string;
      messageCount: number;
      lastMessage: string;
    }>
  >([]);
  const [chatApiFailed, setChatApiFailed] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [inquiries, setInquiries] = useState<MockInquiry[]>(MOCK_INQUIRIES);
  const [selectedInquiry, setSelectedInquiry] = useState<MockInquiry | null>(null);
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
    setSavedItems(
      MOCK_PRODUCTS.slice(0, 3).map((p, i) => ({
        slug: p.slug,
        savedAt: new Date(Date.now() - (i + 1) * 86400000 * 3).toISOString(),
      })),
    );
  }, []);

  useEffect(() => {
    if (mounted && !user) router.replace("/auth/login");
  }, [mounted, user, router]);

  useEffect(() => {
    if (user) setProfile((p) => ({ ...p, name: user.name, email: user.email }));
  }, [user]);

  // 我的询盘：登录后从 API 拉取（失败回退 Mock）
  useEffect(() => {
    if (!token) return;
    type ApiInquiry = {
      id: string;
      date: string;
      categories: string[];
      status: string;
      description: string;
      followUps: Array<{ ts: string; author: string; note: string }>;
    };
    apiGet<{ items: ApiInquiry[] }>("/api/inquiries/mine", token)
      .then((data) => {
        setInquiries(
          data.items.map((i) => ({
            id: i.id,
            date: i.date,
            categories: i.categories as MockInquiry["categories"],
            status: i.status as MockInquiry["status"],
            description: { en: i.description, zh: i.description },
            details: { en: i.description, zh: i.description },
            followUps: i.followUps.map((f) => ({
              ts: f.ts,
              author: { en: f.author, zh: f.author },
              note: { en: f.note, zh: f.note },
            })),
          })),
        );
      })
      .catch(() => {
        // API 不可用时保留 Mock 展示
      });
  }, [token]);

  // 个人资料：从 API 拉取
  useEffect(() => {
    if (!token) return;
    type ApiProfile = {
      name: string;
      email: string;
      company: string | null;
      phone: string | null;
      country: string | null;
    };
    apiGet<ApiProfile>("/api/users/me", token)
      .then((me) =>
        setProfile({
          name: me.name,
          email: me.email,
          company: me.company ?? "",
          phone: me.phone ?? "",
          country: me.country ?? "",
        }),
      )
      .catch(() => {
        // API 不可用时保留本地信息
      });
  }, [token]);

  // AI 会话列表：从 API 拉取（失败回退 localStorage 缓存）
  useEffect(() => {
    if (!token) return;
    apiGet<{ items: typeof conversations }>("/api/chat/conversations", token)
      .then((data) => setConversations(data.items))
      .catch(() => setChatApiFailed(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

  const savedProducts = savedItems
    .map((item) => ({ item, product: getProductBySlug(item.slug) }))
    .filter(
      (entry): entry is { item: SavedItem; product: NonNullable<typeof entry.product> } =>
        entry.product !== undefined,
    );

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
                {inquiries.map((inquiry) => (
                  <button
                    key={inquiry.id}
                    type="button"
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left transition-all hover:border-blue-300 hover:shadow-md"
                  >
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
                    <div className="mt-3 flex items-center gap-2">
                      <p className="text-muted line-clamp-2 flex-1 text-sm leading-relaxed">
                        {inquiry.description[loc]}
                      </p>
                      <ChevronRight className="text-subtle h-4 w-4 shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* AI 对话历史 */}
            {tab === "chat" && (
              <div>
                {conversations.length > 0 ? (
                  <div className="space-y-3">
                    {conversations.map((c) => (
                      <ChatHistoryViewer
                        key={c.id}
                        title={
                          c.lastMessage || t("chatHistory.messagesCount", { count: c.messageCount })
                        }
                        subtitle={`${t("chatHistory.lastActive")}: ${new Date(c.updatedAt).toLocaleString(locale)}${c.productModel ? ` · ${c.productModel}` : ""}`}
                        fetchMessages={async () => {
                          const detail = await apiGet<{ items: StoredChatMessage[] }>(
                            `/api/chat/conversations/${c.id}/messages`,
                            token ?? undefined,
                          );
                          return detail.items;
                        }}
                      />
                    ))}
                  </div>
                ) : chatApiFailed && chatMessages.length > 0 ? (
                  <ChatHistoryViewer messages={chatMessages} />
                ) : (
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 py-10 text-center">
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
                )}
              </div>
            )}

            {/* 收藏的产品 */}
            {tab === "saved" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedProducts.map(({ item, product }) => (
                  <div
                    key={product.slug}
                    className="relative rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <button
                      type="button"
                      aria-label={t("saved.remove")}
                      onClick={() =>
                        setSavedItems((prev) => prev.filter((s) => s.slug !== product.slug))
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
                    <p className="text-subtle mt-1 text-xs">
                      {t("saved.savedAt", {
                        date: new Date(item.savedAt).toLocaleDateString(locale),
                      })}
                    </p>
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const me = await apiPatch<{ name: string; email: string }>(
                      "/api/users/me",
                      {
                        name: profile.name,
                        company: profile.company,
                        phone: profile.phone,
                        country: profile.country,
                      },
                      token ?? undefined,
                    );
                    login({ name: me.name, email: me.email });
                    setProfileSaved(true);
                    window.setTimeout(() => setProfileSaved(false), 3000);
                  } catch {
                    setProfileSaved(false);
                  }
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

      {/* 询盘详情抽屉 */}
      {selectedInquiry && (
        <InquiryDrawer inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />
      )}
    </section>
  );
}
