"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuthStore } from "@/store/auth";

/** Mock 管理员凭据（后续接入真实认证） */
const MOCK_EMAIL = "admin@hiwhale.com";
const MOCK_PASSWORD = "admin123";

/** 登录页 */
export default function LoginPage() {
  const router = useRouter();
  const admin = useAdminAuthStore((s) => s.admin);
  const login = useAdminAuthStore((s) => s.login);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && admin) router.replace("/dashboard");
  }, [mounted, admin, router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      login({ name: "系统管理员", email, role: UserRole.SUPER_ADMIN });
      router.push("/dashboard");
    } else {
      setError("邮箱或密码错误（演示账号：admin@hiwhale.com / admin123）");
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
            <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90 w-full">
              登录
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
