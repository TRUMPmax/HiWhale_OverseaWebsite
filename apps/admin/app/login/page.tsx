"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuthStore } from "@/store/auth";

/** 员工登录：真实 API（POST /api/auth/staff/login） */
export default function LoginPage() {
  const router = useRouter();
  const admin = useAdminAuthStore((s) => s.admin);
  const login = useAdminAuthStore((s) => s.login);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && admin) router.replace("/dashboard");
  }, [mounted, admin, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth/staff/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        user?: { id: string; name: string; email: string };
        role?: UserRole;
        token?: string;
      };
      if (!res.ok || !data.user || !data.token || !data.role) {
        throw new Error(data.message ?? `登录失败（${res.status}）`);
      }
      login({ name: data.user.name, email: data.user.email, role: data.role }, data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || admin) {
    return <div className="min-h-screen bg-slate-100" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center pb-2">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-amber-500">Hi</span>
            <span className="text-brand-navy">Whale</span>
            <span className="text-brand-navy ml-2 text-base font-medium">管理后台</span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hiwhale.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              disabled={submitting}
              className="bg-brand-blue hover:bg-brand-blue/90 w-full"
            >
              {submitting ? "登录中…" : "登录"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
