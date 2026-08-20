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
import { SolutionFormDialog } from "@/components/solutions/SolutionFormDialog";
import { useSolutionsStore, type AdminSolution } from "@/store/solutions";

const PAGE_SIZE = 8;

/** 方案管理 */
export default function SolutionsPage() {
  const solutions = useSolutionsStore((s) => s.solutions);
  const toggleStatus = useSolutionsStore((s) => s.toggleStatus);
  const deleteSolution = useSolutionsStore((s) => s.deleteSolution);

  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminSolution | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<AdminSolution | null>(null);

  const pageItems = solutions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        title="方案管理"
        description="管理行业方案内容"
        action={
          <Button
            className="bg-brand-blue hover:bg-brand-blue/90"
            onClick={() => {
              setEditing(undefined);
              setFormOpen(true);
            }}
          >
            <Plus /> 新增方案
          </Button>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>方案标题</TableHead>
              <TableHead>行业</TableHead>
              <TableHead>关联设备数</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((solution) => (
              <TableRow key={solution.id}>
                <TableCell className="font-medium">{solution.titleZh}</TableCell>
                <TableCell>{getLocalizedLabel(INDUSTRY_LABELS, solution.industry, "zh")}</TableCell>
                <TableCell>{solution.products.length}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => {
                      toggleStatus(solution.id);
                      toast.success("状态已更新");
                    }}
                    title="点击切换发布状态"
                  >
                    <Badge
                      className={
                        solution.status === "published"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }
                    >
                      {solution.status === "published" ? "已发布" : "草稿"}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className="text-brand-blue text-sm font-medium hover:underline"
                    onClick={() => {
                      setEditing(solution);
                      setFormOpen(true);
                    }}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="ml-4 text-sm font-medium text-red-600 hover:underline"
                    onClick={() => setPendingDelete(solution)}
                  >
                    删除
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-sm text-slate-400">
                  暂无方案
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination
          total={solutions.length}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      <SolutionFormDialog open={formOpen} onOpenChange={setFormOpen} initial={editing} />
      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        name={pendingDelete?.titleZh ?? ""}
        onConfirm={() => {
          if (pendingDelete) deleteSolution(pendingDelete.id);
          toast.success("已删除");
        }}
      />
    </div>
  );
}
