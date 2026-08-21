"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { NAV_ITEMS } from "./Sidebar";
import { useAdminAuthStore } from "@/store/auth";

/** 顶栏：当前页标题 + 搜索 + 通知 + 头像菜单 */
export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAdminAuthStore((s) => s.admin);
  const logout = useAdminAuthStore((s) => s.logout);

  const title = NAV_ITEMS.find((item) => pathname.startsWith(item.href))?.label ?? "仪表盘";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <h1 className="text-base font-semibold text-slate-900">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="搜索…" className="w-56 pl-9" readOnly />
        </div>

        <button
          type="button"
          aria-label="通知"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-blue text-xs font-bold text-white">
                {admin?.name.charAt(0) ?? "A"}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{admin?.name}</div>
              <div className="truncate text-xs text-slate-500">{admin?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>个人信息</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                logout();
                router.push("/login");
              }}
            >
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
