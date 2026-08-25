"use client";

import { useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { getLocalizedLabel, USER_ROLE_LABELS, UserRole } from "@hiwhale/shared/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { useStaffStore, type AdminStaff } from "@/store/staff";

const ROLE_BADGE: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-brand-navy text-white hover:bg-brand-navy",
  SALES: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  PRODUCT_TECH: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  OPERATIONS: "bg-slate-100 text-slate-600 hover:bg-slate-100",
};

const ROLE_OPTIONS = Object.values(UserRole);

/** 权限矩阵：角色 × 模块（静态展示） */
const MATRIX_MODULES = [
  "仪表盘",
  "产品管理",
  "询盘管理",
  "用户管理",
  "AI 模块",
  "内容管理",
  "员工管理",
  "系统设置",
];
const MATRIX: Record<UserRole, boolean[]> = {
  SUPER_ADMIN: [true, true, true, true, true, true, true, true],
  SALES: [true, false, true, true, true, false, false, false],
  PRODUCT_TECH: [true, true, false, false, true, true, false, false],
  OPERATIONS: [true, false, true, false, false, true, false, false],
};

const EMPTY_FORM = { name: "", email: "", role: UserRole.SALES, password: "" };

/** 员工管理：列表 + 新增/编辑 + 禁用 + 权限矩阵 */
export default function StaffPage() {
  const staff = useStaffStore((s) => s.staff);
  const fetchStaff = useStaffStore((s) => s.fetchStaff);
  const addStaff = useStaffStore((s) => s.addStaff);
  const updateStaff = useStaffStore((s) => s.updateStaff);
  const toggleStatus = useStaffStore((s) => s.toggleStatus);
  const deleteStaff = useStaffStore((s) => s.deleteStaff);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminStaff | null>(null);

  useEffect(() => {
    void fetchStaff().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
  }, [fetchStaff]);
  const [editing, setEditing] = useState<AdminStaff | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (item: AdminStaff) => {
    setEditing(item);
    setForm({ name: item.name, email: item.email, role: item.role, password: "" });
    setDialogOpen(true);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("请填写姓名与邮箱");
      return;
    }
    if (!editing && !form.password.trim()) {
      toast.error("请设置初始密码");
      return;
    }
    try {
      if (editing) {
        await updateStaff(editing.id, { name: form.name, role: form.role });
      } else {
        await addStaff({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          password: form.password,
        });
      }
      toast.success("保存成功");
      setDialogOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="员工管理"
        description="员工账号与角色权限"
        action={
          <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={openCreate}>
            <Plus /> 新增员工
          </Button>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-slate-500">{item.email}</TableCell>
                <TableCell>
                  <Badge className={ROLE_BADGE[item.role]}>
                    {getLocalizedLabel(USER_ROLE_LABELS, item.role, "zh")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.status === "active"
                        ? "bg-green-50 text-green-700 hover:bg-green-50"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-100"
                    }
                  >
                    {item.status === "active" ? "正常" : "已禁用"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className="text-brand-blue text-sm font-medium hover:underline"
                    onClick={() => openEdit(item)}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="ml-4 text-sm font-medium text-red-600 hover:underline"
                    onClick={() => {
                      void toggleStatus(item.id)
                        .then(() => toast.success(item.status === "active" ? "已禁用" : "已启用"))
                        .catch((e) => toast.error(e instanceof Error ? e.message : "操作失败"));
                    }}
                  >
                    {item.status === "active" ? "禁用" : "启用"}
                  </button>
                  <button
                    type="button"
                    className="ml-4 text-sm font-medium text-red-600 hover:underline"
                    onClick={() => setPendingDelete(item)}
                  >
                    删除
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 权限矩阵 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">权限矩阵</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>角色</TableHead>
                {MATRIX_MODULES.map((module) => (
                  <TableHead key={module} className="text-center">
                    {module}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROLE_OPTIONS.map((role) => (
                <TableRow key={role}>
                  <TableCell>
                    <Badge className={ROLE_BADGE[role]}>
                      {getLocalizedLabel(USER_ROLE_LABELS, role, "zh")}
                    </Badge>
                  </TableCell>
                  {MATRIX[role].map((allowed, index) => (
                    <TableCell key={index} className="text-center">
                      {allowed ? (
                        <Check className="mx-auto h-4 w-4 text-green-600" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-slate-300" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增/编辑弹窗 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "编辑员工" : "新增员工"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>姓名 *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>邮箱 *</Label>
              <Input
                type="email"
                value={form.email}
                disabled={!!editing}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>角色</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm({ ...form, role: v as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getLocalizedLabel(USER_ROLE_LABELS, role, "zh")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!editing && (
              <div className="space-y-1.5">
                <Label>初始密码 *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={submit}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除员工确认 */}
      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除员工？</DialogTitle>
            <DialogDescription>
              删除「{pendingDelete?.name}」后将无法恢复。
              {(pendingDelete?.assignedInquiries ?? 0) > 0 &&
                `该员工名下有 ${pendingDelete?.assignedInquiries} 条询盘，删除后将释放为未分配，可由其他员工继续跟进。`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              取消
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (pendingDelete) {
                  void deleteStaff(pendingDelete.id)
                    .then(({ releasedInquiries }) =>
                      toast.success(
                        releasedInquiries > 0
                          ? `已删除，释放 ${releasedInquiries} 条询盘`
                          : "已删除",
                      ),
                    )
                    .catch((e) => toast.error(e instanceof Error ? e.message : "删除失败"));
                }
                setPendingDelete(null);
              }}
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
