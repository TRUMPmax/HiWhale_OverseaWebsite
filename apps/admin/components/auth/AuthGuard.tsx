"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAdminAuthStore } from "@/store/auth";

/** 受保护路由守卫：挂载后读取持久化登录态，未登录跳转 /login */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const admin = useAdminAuthStore((s) => s.admin);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !admin) router.replace("/login");
  }, [mounted, admin, router]);

  if (!mounted || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="text-brand-blue h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
