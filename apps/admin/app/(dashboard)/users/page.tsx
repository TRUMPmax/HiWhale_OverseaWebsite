"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { UserDrawer } from "@/components/users/UserDrawer";
import { MOCK_PORTAL_USERS, type MockPortalUser } from "@/lib/mock/users";

const PAGE_SIZE = 8;

/** 用户管理：搜索 + 详情抽屉 + 禁用/启用 */
export default function UsersPage() {
  const [users, setUsers] = useState<MockPortalUser[]>(MOCK_PORTAL_USERS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MockPortalUser | null>(null);
  const [pendingToggle, setPendingToggle] = useState<MockPortalUser | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleStatus = (user: MockPortalUser) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: u.status === "active" ? "disabled" : "active" } : u,
      ),
    );
    toast.success(user.status === "active" ? "已禁用该用户" : "已启用该用户");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="用户管理"
        description="门户注册用户与 AI 使用情况"
        action={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索姓名 / 公司 / 邮箱…"
              className="w-64 pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>公司</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>国家/地区</TableHead>
              <TableHead>注册时间</TableHead>
              <TableHead>AI 对话次数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell className="text-slate-500">{user.email}</TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell className="text-slate-500">{user.registeredAt}</TableCell>
                <TableCell>{user.aiChatCount}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-green-50 text-green-700 hover:bg-green-50"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                    }
                  >
                    {user.status === "active" ? "正常" : "已禁用"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className="text-brand-blue text-sm font-medium hover:underline"
                    onClick={() => setSelected(user)}
                  >
                    查看详情
                  </button>
                  <button
                    type="button"
                    className="ml-4 text-sm font-medium text-red-600 hover:underline"
                    onClick={() => setPendingToggle(user)}
                  >
                    {user.status === "active" ? "禁用" : "启用"}
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-sm text-slate-400">
                  暂无匹配的用户
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination
          total={filtered.length}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {selected && <UserDrawer user={selected} onClose={() => setSelected(null)} />}

      <Dialog
        open={pendingToggle !== null}
        onOpenChange={(open) => !open && setPendingToggle(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingToggle?.status === "active" ? "确认禁用？" : "确认启用？"}
            </DialogTitle>
            <DialogDescription>
              {pendingToggle?.status === "active"
                ? `禁用后，${pendingToggle?.name} 将无法登录门户与使用 AI 助手。`
                : `启用后，${pendingToggle?.name} 将恢复正常使用。`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingToggle(null)}>
              取消
            </Button>
            <Button
              className={
                pendingToggle?.status === "active"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-brand-blue hover:bg-brand-blue/90"
              }
              onClick={() => {
                if (pendingToggle) toggleStatus(pendingToggle);
                setPendingToggle(null);
              }}
            >
              {pendingToggle?.status === "active" ? "确认禁用" : "确认启用"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
