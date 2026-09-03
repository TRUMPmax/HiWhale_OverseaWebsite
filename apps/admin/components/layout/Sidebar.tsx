"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  ChevronDown,
  FileText,
  FolderOpen,
  FolderTree,
  Images,
  Inbox,
  Layers,
  LayoutDashboard,
  MessageSquareText,
  MonitorCog,
  Package,
  Settings,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { key: string; label: string; icon: LucideIcon; items: NavItem[] };

/** 一级类目 → 二级条目（顺序即展示顺序） */
export const NAV_GROUPS: NavGroup[] = [
  {
    key: "overview",
    label: "总览",
    icon: LayoutDashboard,
    items: [{ href: "/dashboard", label: "仪表盘", icon: LayoutDashboard }],
  },
  {
    key: "site",
    label: "门户内容",
    icon: FileText,
    items: [
      { href: "/products", label: "产品管理", icon: Package },
      { href: "/categories", label: "品类管理", icon: FolderTree },
      { href: "/media", label: "素材管理", icon: Images },
      { href: "/solutions", label: "方案管理", icon: Layers },
      { href: "/cases", label: "案例管理", icon: FolderOpen },
      { href: "/content", label: "内容管理", icon: FileText },
    ],
  },
  {
    key: "crm",
    label: "线索与客户",
    icon: Inbox,
    items: [
      { href: "/inquiries", label: "询盘管理", icon: Inbox },
      { href: "/users", label: "用户管理", icon: Users },
    ],
  },
  {
    key: "ai",
    label: "AI",
    icon: Bot,
    items: [
      { href: "/chat-logs", label: "AI 对话记录", icon: MessageSquareText },
      { href: "/knowledge-base", label: "AI 知识库", icon: BookOpen },
      { href: "/ai-settings", label: "AI 设置", icon: Bot },
    ],
  },
  {
    key: "system",
    label: "系统",
    icon: MonitorCog,
    items: [
      { href: "/staff", label: "员工管理", icon: UserCog },
      { href: "/settings", label: "系统设置", icon: Settings },
    ],
  },
];

/** 兼容导出：Topbar 等消费方仍按扁平列表取标题 */
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

const STORAGE_KEY = "admin-nav-expanded";

/** 左侧固定导航栏（一级类目 + 下拉二级条目；展开状态持久化到 localStorage） */
export function Sidebar() {
  const pathname = usePathname();
  const activeGroupKey =
    NAV_GROUPS.find((g) =>
      g.items.some((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)),
    )?.key ?? "overview";
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([activeGroupKey]));

  // 挂载后读取持久化的展开状态（SSR 安全）
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setExpanded(new Set([...arr, activeGroupKey]));
      }
    } catch {
      // 忽略损坏的本地数据
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // 隐私模式等场景忽略
      }
      return next;
    });

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-amber-500">Hi</span>
          <span className="text-brand-navy">Whale Robotics</span>
        </div>
        <div className="mt-0.5 text-xs text-slate-500">管理后台</div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const isOpen = expanded.has(group.key);
          const groupActive = group.key === activeGroupKey;
          return (
            <div key={group.key}>
              <button
                type="button"
                onClick={() => toggle(group.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  groupActive
                    ? "text-brand-blue bg-blue-50 font-medium"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <group.icon className="h-4 w-4" />
                {group.label}
                <ChevronDown
                  className={cn(
                    "ml-auto h-3.5 w-3.5 transition-transform",
                    isOpen ? "rotate-0" : "-rotate-90",
                  )}
                />
              </button>
              {isOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {group.items.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg py-2 pl-9 pr-3 text-[13px] transition-colors",
                          active
                            ? "text-brand-blue bg-blue-50 font-medium"
                            : "text-slate-500 hover:bg-slate-50",
                        )}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
