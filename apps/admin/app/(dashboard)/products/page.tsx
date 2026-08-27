"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, GripVertical, Image as ImageIcon, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getLocalizedLabel, PRODUCT_CATEGORY_LABELS } from "@hiwhale/shared/constants";
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
import { fetchAdminTaxonomy, STATIC_ADMIN_TAXONOMY, type TaxonomyGroup } from "@/lib/taxonomy";

const PAGE_SIZE = 8;

/** 可拖动排序的产品行 */
function SortableProductRow({ product }: { product: AdminProduct }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });
  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-10 bg-blue-50 shadow-lg" : undefined}
    >
      <TableCell className="w-12">
        <button
          type="button"
          aria-label="拖动排序"
          className="cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.model}
            className="h-10 w-14 rounded-md border border-slate-200 object-cover"
          />
        ) : (
          <span className="flex h-10 w-14 flex-col items-center justify-center rounded-md bg-slate-100 text-slate-400">
            <ImageIcon className="h-4 w-4" />
            <span className="mt-0.5 font-mono text-[0.625rem]">{product.model}</span>
          </span>
        )}
      </TableCell>
      <TableCell className="font-medium">{product.name.zh}</TableCell>
      <TableCell className="font-mono text-xs">{product.model}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, product.category, "zh")}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          className={
            product.status === "on"
              ? "bg-green-50 text-green-700 hover:bg-green-50"
              : "bg-slate-100 text-slate-500 hover:bg-slate-100"
          }
        >
          {product.status === "on" ? "上架" : "下架"}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

/** 产品管理列表：搜索 + 品类筛选 + 上下架 + 删除 + 分页（数据来自 API） */
export default function ProductsPage() {
  const products = useProductsStore((s) => s.products);
  const loading = useProductsStore((s) => s.loading);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const toggleStatus = useProductsStore((s) => s.toggleStatus);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);
  const reorderProducts = useProductsStore((s) => s.reorderProducts);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);
  /** 排序模式：显示全量列表 + 拖动把手，自动保存 */
  const [sortMode, setSortMode] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  /** 分类体系：优先 API（DB 实体），失败回退静态常量 */
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>(STATIC_ADMIN_TAXONOMY);
  useEffect(() => {
    void fetchAdminTaxonomy()
      .then(setTaxonomy)
      .catch(() => {});
  }, []);

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
  // 排序模式展示全量（拖动排序针对完整列表，跨页无意义）
  const sortItems = sortMode ? filtered : pageItems;

  const onProductDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = sortItems.map((p) => p.id);
    const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
    void reorderProducts(next)
      .then(() => toast.success("顺序已保存"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "排序保存失败"));
  };

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
            {taxonomy
              .flatMap((g) => g.categories)
              .map((c) => (
                <SelectItem key={c.key} value={c.key}>
                  {c.nameJson.zh}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Link href="/products/new" className="ml-auto">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus /> 新增产品
          </Button>
        </Link>
        <Button
          variant={sortMode ? "default" : "outline"}
          className={sortMode ? "bg-brand-blue hover:bg-brand-blue/90" : ""}
          onClick={() => {
            setSortMode((v) => !v);
            setPage(1);
          }}
        >
          <ArrowUpDown /> {sortMode ? "完成排序" : "排序模式"}
        </Button>
      </div>
      {sortMode && (
        <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          排序模式：拖动左侧把手调整产品顺序，松开自动保存（门户产品列表按此顺序展示）。此模式下显示全量列表，不分页。
        </p>
      )}

      {/* 列表 */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {sortMode && <TableHead className="w-12" />}
              <TableHead className="w-20">缩略图</TableHead>
              <TableHead>产品名</TableHead>
              <TableHead>型号</TableHead>
              <TableHead>品类</TableHead>
              <TableHead>状态</TableHead>
              {!sortMode && <TableHead>创建时间</TableHead>}
              {!sortMode && <TableHead className="text-right">操作</TableHead>}
            </TableRow>
          </TableHeader>
          {sortMode ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onProductDragEnd}
            >
              <SortableContext
                items={sortItems.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {sortItems.map((p) => (
                    <SortableProductRow key={p.id} product={p} />
                  ))}
                  {sortItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-sm text-slate-400">
                        {loading ? "加载中…" : "暂无匹配的产品"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </SortableContext>
            </DndContext>
          ) : (
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
          )}
        </Table>

        {/* 分页（排序模式下隐藏） */}
        {!sortMode && (
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
        )}
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
