"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Image as ImageIcon, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  getLocalizedLabel,
  PRODUCT_CATEGORY_LABELS,
  ProductCategory,
} from "@hiwhale/shared/constants";
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
import { useProductsStore, type AdminProduct } from "@/store/products";

const PAGE_SIZE = 8;

/** 产品管理列表：搜索 + 品类筛选 + 上下架 + 删除 + 分页（数据来自 API） */
export default function ProductsPage() {
  const products = useProductsStore((s) => s.products);
  const loading = useProductsStore((s) => s.loading);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const toggleStatus = useProductsStore((s) => s.toggleStatus);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);

  useEffect(() => {
    void fetchProducts().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
  }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.zh.toLowerCase().includes(search.toLowerCase()) ||
      p.model.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    return matchSearch && matchCategory;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="搜索产品名 / 型号…"
            className="w-64 pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="全部品类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部品类</SelectItem>
            {Object.values(ProductCategory).map((c) => (
              <SelectItem key={c} value={c}>
                {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, c, "zh")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Link href="/products/new" className="ml-auto">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus /> 新增产品
          </Button>
        </Link>
      </div>

      {/* 列表 */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">缩略图</TableHead>
              <TableHead>产品名</TableHead>
              <TableHead>型号</TableHead>
              <TableHead>品类</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt={p.model}
                      className="h-10 w-14 rounded-md border border-slate-200 object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-14 flex-col items-center justify-center rounded-md bg-slate-100 text-slate-400">
                      <ImageIcon className="h-4 w-4" />
                      <span className="mt-0.5 font-mono text-[0.625rem]">{p.model}</span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{p.name.zh}</TableCell>
                <TableCell className="font-mono text-xs">{p.model}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, p.category, "zh")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => {
                      void toggleStatus(p.id).catch((e) =>
                        toast.error(e instanceof Error ? e.message : "操作失败"),
                      );
                    }}
                    title="点击切换上下架"
                  >
                    <Badge
                      className={
                        p.status === "on"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }
                    >
                      {p.status === "on" ? "上架" : "下架"}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell className="text-slate-500">{p.createdAt.slice(0, 10)}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/products/${p.id}/edit`}
                    className="text-brand-blue text-sm font-medium hover:underline"
                  >
                    编辑
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(p)}
                    className="ml-4 text-sm font-medium text-red-600 hover:underline"
                  >
                    删除
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-sm text-slate-400">
                  {loading ? "加载中…" : "暂无匹配的产品"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* 分页 */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <span className="text-xs text-slate-500">共 {filtered.length} 条</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              上一页
            </Button>
            <span className="text-xs text-slate-500">
              第 {currentPage}/{totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      </div>

      {/* 删除确认 */}
      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除？</DialogTitle>
            <DialogDescription>
              删除产品「{pendingDelete?.name.zh}」（{pendingDelete?.model}）后将无法恢复。
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
                  void deleteProduct(pendingDelete.id)
                    .then(() => toast.success("已删除"))
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
