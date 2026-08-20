"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { getLocalizedLabel, INDUSTRY_LABELS } from "@hiwhale/shared/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { CaseFormDialog } from "@/components/cases/CaseFormDialog";
import { useCasesStore, type AdminCase } from "@/store/cases";

const PAGE_SIZE = 8;

/** 案例管理 */
export default function CasesPage() {
  const cases = useCasesStore((s) => s.cases);
  const toggleStatus = useCasesStore((s) => s.toggleStatus);
  const deleteCase = useCasesStore((s) => s.deleteCase);

  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCase | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<AdminCase | null>(null);

  const pageItems = cases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="案例管理"
        description="管理客户案例内容"
        action={
          <Button
            className="bg-brand-blue hover:bg-brand-blue/90"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus /> 新增案例
          </Button>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>客户名</TableHead>
              <TableHead>行业</TableHead>
              <TableHead>项目名</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.clientName}</TableCell>
                <TableCell>{getLocalizedLabel(INDUSTRY_LABELS, item.industry, "zh")}</TableCell>
                <TableCell className="max-w-64 truncate text-slate-600">{item.project}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => {
                      toggleStatus(item.id);
                      toast.success("状态已更新");
                    }}
                    title="点击切换发布状态"
                  >
                    <Badge
                      className={
                        item.status === "published"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }
                    >
                      {item.status === "published" ? "已发布" : "草稿"}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className="text-brand-blue text-sm font-medium hover:underline"
                    onClick={() => {
                      setEditing(item);
                      setFormOpen(true);
                    }}
                  >
                    编辑
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
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-sm text-slate-400">
                  暂无案例
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination total={cases.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>

      <CaseFormDialog open={formOpen} onOpenChange={setFormOpen} initial={editing} />
      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        name={pendingDelete?.project ?? ""}
        onConfirm={() => {
          if (pendingDelete) deleteCase(pendingDelete.id);
          toast.success("已删除");
        }}
      />
    </div>
  );
}
