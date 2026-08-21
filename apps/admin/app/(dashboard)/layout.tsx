import { AuthGuard } from "@/components/auth/AuthGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

/** 受保护的管理台外壳：侧边栏 + 顶栏 + 内容区（登录守卫） */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-w-[1024px]">
        <Sidebar />
        <div className="pl-60">
          <Topbar />
          <main className="min-h-screen bg-slate-50 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
