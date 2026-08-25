"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  FileText,
  FolderOpen,
  FolderTree,
  Images,
  Inbox,
  Layers,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Settings,
  UserCog,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/products", label: "产品管理", icon: Package },
  { href: "/categories", label: "品类管理", icon: FolderTree },
  { href: "/media", label: "素材管理", icon: Images },
  { href: "/solutions", label: "方案管理", icon: Layers },
  { href: "/cases", label: "案例管理", icon: FolderOpen },
  { href: "/inquiries", label: "询盘管理", icon: Inbox },
  { href: "/users", label: "用户管理", icon: Users },
  { href: "/chat-logs", label: "AI 对话记录", icon: MessageSquareText },
  { href: "/knowledge-base", label: "AI 知识库", icon: BookOpen },
  { href: "/ai-settings", label: "AI 设置", icon: Bot },
  { href: "/content", label: "内容管理", icon: FileText },
  { href: "/staff", label: "员工管理", icon: UserCog },
  { href: "/settings", label: "系统设置", icon: Settings },
] as const;

/** 左侧固定导航栏 */
export function Sidebar() {
  const pathname = usePathname();

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
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "text-brand-blue bg-blue-50 font-medium"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
