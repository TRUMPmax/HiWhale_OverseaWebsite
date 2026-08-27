"use client";

import { useEffect, useState } from "react";
import { FolderTree, GripVertical, Plus, Tags } from "lucide-react";
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
import { Label } from "@/components/ui/label";
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
import { adminApi } from "@/lib/api";
import { useAdminAuthStore } from "@/store/auth";
import { fetchAdminTaxonomy, type TaxonomyGroup } from "@/lib/taxonomy";

type EntityKind = "group" | "category";

type FormState = {
  kind: EntityKind;
  editing: { id: string } | null;
  key: string;
  nameZh: string;
  nameEn: string;
  sort: number;
};

const EMPTY_FORM: FormState = {
  kind: "category",
  editing: null,
  key: "",
  nameZh: "",
  nameEn: "",
  sort: 0,
};

/** 英文名称 → key 自动 slug */
function slugify(en: string): string {
  return (
    en
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "NEW"
  );
}

/** 可拖动的大类项 */
function SortableGroupItem({
  group,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  group: TaxonomyGroup;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group flex items-center gap-1 rounded-lg ${isDragging ? "relative z-10 bg-blue-50 shadow-lg" : ""}`}
    >
      <button
        type="button"
        aria-label="拖动排序"
        className="cursor-grab touch-none px-1 text-slate-300 hover:text-slate-500 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onSelect}
        className={`flex-1 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
          selected ? "text-brand-blue bg-blue-50 font-medium" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        {group.nameJson.zh}
        <span className="ml-1 text-xs text-slate-400">({group.categories.length})</span>
      </button>
      <button
        type="button"
        aria-label="编辑大类"
        className="text-brand-blue hidden px-1 text-xs hover:underline group-hover:block"
        onClick={onEdit}
      >
        编辑
      </button>
      <button
        type="button"
        aria-label="删除大类"
        className="hidden px-1 text-xs text-red-600 hover:underline group-hover:block"
        onClick={onDelete}
      >
        删除
      </button>
    </div>
  );
}

/** 可拖动的品类行 */
function SortableCategoryRow({
  category,
  onEdit,
  onDelete,
}: {
  category: TaxonomyGroup["categories"][number];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });
  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "relative z-10 bg-blue-50 shadow-lg" : undefined}
    >
      <TableCell className="w-10">
        <button
          type="button"
          aria-label="拖动排序"
          className="cursor-grab touch-none text-slate-300 hover:text-slate-500 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{category.nameJson.zh}</TableCell>
      <TableCell className="text-slate-500">{category.nameJson.en}</TableCell>
      <TableCell className="font-mono text-xs">{category.key}</TableCell>
      <TableCell className="text-right">
        <button
          type="button"
          className="text-brand-blue text-sm font-medium hover:underline"
          onClick={onEdit}
        >
          编辑
        </button>
        <button
          type="button"
          className="ml-4 text-sm font-medium text-red-600 hover:underline"
          onClick={onDelete}
        >
          删除
        </button>
      </TableCell>
    </TableRow>
  );
}

/** 级联删除确认弹窗（409 时展示） */
type CascadeState = {
  kind: EntityKind;
  id: string;
  name: string;
  categoryCount?: number;
  productCount: number;
} | null;

/** 品类管理：左侧大类列表 + 右侧品类表格（增删改 + 级联删除保护） */
export default function CategoriesPage() {
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    kind: EntityKind;
    id: string;
    name: string;
  } | null>(null);
  const [cascade, setCascade] = useState<CascadeState>(null);

  const refresh = async () => {
    const data = await fetchAdminTaxonomy();
    setTaxonomy(data);
    if (!selectedGroupId && data[0]) setSelectedGroupId(data[0].id);
  };

  useEffect(() => {
    void refresh().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedGroup = taxonomy.find((g) => g.id === selectedGroupId);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  /** 大类拖动排序（乐观更新 + 持久化） */
  const onGroupDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = taxonomy.map((g) => g.id);
    const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
    const rank = new Map(next.map((id, i) => [id, i]));
    setTaxonomy((prev) =>
      [...prev].sort((a, b) => (rank.get(a.id) ?? 9999) - (rank.get(b.id) ?? 9999)),
    );
    void adminApi("/api/taxonomy/groups/reorder", { method: "PUT", body: { ids: next } })
      .then(() => toast.success("大类顺序已保存"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "排序保存失败"));
  };

  /** 品类拖动排序（当前大类内） */
  const onCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !selectedGroup) return;
    const ids = selectedGroup.categories.map((c) => c.id);
    const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
    const rank = new Map(next.map((id, i) => [id, i]));
    setTaxonomy((prev) =>
      prev.map((g) =>
        g.id === selectedGroup.id
          ? {
              ...g,
              categories: [...g.categories].sort(
                (a, b) => (rank.get(a.id) ?? 9999) - (rank.get(b.id) ?? 9999),
              ),
            }
          : g,
      ),
    );
    void adminApi("/api/taxonomy/categories/reorder", { method: "PUT", body: { ids: next } })
      .then(() => toast.success("品类顺序已保存"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "排序保存失败"));
  };

  // ---------- 保存（新增/编辑） ----------
  const submitForm = async () => {
    if (!form) return;
    if (!form.nameZh.trim() || !form.nameEn.trim()) {
      toast.error("请填写中文与英文名称");
      return;
    }
    const key = (form.key.trim() || slugify(form.nameEn)).toUpperCase();
    const nameJson = { zh: form.nameZh.trim(), en: form.nameEn.trim() };
    try {
      if (form.kind === "group") {
        const body = { key, nameJson, sort: form.sort };
        if (form.editing) {
          await adminApi(`/api/taxonomy/groups/${form.editing.id}`, { method: "PUT", body });
        } else {
          await adminApi("/api/taxonomy/groups", { method: "POST", body });
        }
      } else {
        if (!selectedGroupId) return;
        const body = { key, groupId: selectedGroupId, nameJson, sort: form.sort };
        if (form.editing) {
          await adminApi(`/api/taxonomy/categories/${form.editing.id}`, { method: "PUT", body });
        } else {
          await adminApi("/api/taxonomy/categories", { method: "POST", body });
        }
      }
      toast.success("保存成功");
      setForm(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };

  // ---------- 删除（409 → 级联确认） ----------
  const doDelete = async (kind: EntityKind, id: string, cascade: boolean) => {
    try {
      const token = useAdminAuthStore.getState().token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/taxonomy/${kind === "group" ? "groups" : "categories"}/${id}${cascade ? "?cascade=true" : ""}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (res.status === 409) {
        const name = (() => {
          for (const g of taxonomy) {
            if (kind === "group" && g.id === id) return g.nameJson.zh;
            const c = g.categories.find((c) => c.id === id);
            if (c) return c.nameJson.zh;
          }
          return "";
        })();
        const data = (await res.json()) as {
          message?: string;
          productCount?: number;
          categoryCount?: number;
        };
        setCascade({
          kind,
          id,
          name,
          productCount: data.productCount ?? 0,
          categoryCount: data.categoryCount,
        });
        return;
      }
      if (!res.ok) throw new Error(`删除失败（${res.status}）`);
      toast.success("已删除");
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="品类管理" description="产品大类与品类维护（删除受产品引用保护）" />

      <div className="grid grid-cols-[16rem_1fr] gap-6">
        {/* 左侧：大类列表 */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <FolderTree className="text-brand-blue h-4 w-4" /> 产品大类
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="新增大类"
              onClick={() => setForm({ ...EMPTY_FORM, kind: "group", sort: taxonomy.length + 1 })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1 p-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onGroupDragEnd}
            >
              <SortableContext
                items={taxonomy.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                {taxonomy.map((group) => (
                  <SortableGroupItem
                    key={group.id}
                    group={group}
                    selected={selectedGroupId === group.id}
                    onSelect={() => setSelectedGroupId(group.id)}
                    onEdit={() =>
                      setForm({
                        kind: "group",
                        editing: { id: group.id },
                        key: group.key,
                        nameZh: group.nameJson.zh,
                        nameEn: group.nameJson.en,
                        sort: group.sort,
                      })
                    }
                    onDelete={() =>
                      setPendingDelete({ kind: "group", id: group.id, name: group.nameJson.zh })
                    }
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* 右侧：品类表格 */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Tags className="text-brand-blue h-4 w-4" />
              {selectedGroup ? `${selectedGroup.nameJson.zh} 下的品类` : "品类"}
            </span>
            <Button
              size="sm"
              className="bg-brand-blue hover:bg-brand-blue/90"
              disabled={!selectedGroupId}
              onClick={() =>
                setForm({
                  ...EMPTY_FORM,
                  kind: "category",
                  sort: (selectedGroup?.categories.length ?? 0) + 1,
                })
              }
            >
              <Plus /> 新增品类
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10" />
                <TableHead>名称（中文）</TableHead>
                <TableHead>名称（英文）</TableHead>
                <TableHead>Key</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onCategoryDragEnd}
            >
              <SortableContext
                items={(selectedGroup?.categories ?? []).map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {(selectedGroup?.categories ?? []).map((category) => (
                    <SortableCategoryRow
                      key={category.id}
                      category={category}
                      onEdit={() =>
                        setForm({
                          kind: "category",
                          editing: { id: category.id },
                          key: category.key,
                          nameZh: category.nameJson.zh,
                          nameEn: category.nameJson.en,
                          sort: category.sort,
                        })
                      }
                      onDelete={() =>
                        setPendingDelete({
                          kind: "category",
                          id: category.id,
                          name: category.nameJson.zh,
                        })
                      }
                    />
                  ))}
                  {(selectedGroup?.categories.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-sm text-slate-400">
                        该大类下暂无品类
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </SortableContext>
            </DndContext>
          </Table>
        </div>
      </div>

      {/* 新增/编辑弹窗 */}
      <Dialog open={form !== null} onOpenChange={(open) => !open && setForm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {form?.editing ? "编辑" : "新增"}
              {form?.kind === "group" ? "产品大类" : "产品品类"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>名称（中文）*</Label>
                <Input
                  value={form?.nameZh ?? ""}
                  onChange={(e) => form && setForm({ ...form, nameZh: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>名称（英文）*</Label>
                <Input
                  value={form?.nameEn ?? ""}
                  onChange={(e) => form && setForm({ ...form, nameEn: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Key（留空自动生成）</Label>
                <Input
                  className="font-mono"
                  value={form?.key ?? ""}
                  placeholder={form ? slugify(form.nameEn) : ""}
                  onChange={(e) => form && setForm({ ...form, key: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>排序</Label>
                <Input
                  type="number"
                  value={form?.sort ?? 0}
                  onChange={(e) => form && setForm({ ...form, sort: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(null)}>
              取消
            </Button>
            <Button
              className="bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => void submitForm()}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 普通删除确认 */}
      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        name={pendingDelete?.name ?? ""}
        onConfirm={() => {
          if (pendingDelete) void doDelete(pendingDelete.kind, pendingDelete.id, false);
        }}
      />

      {/* 级联删除确认（409） */}
      <Dialog open={cascade !== null} onOpenChange={(open) => !open && setCascade(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>级联删除确认</DialogTitle>
            <DialogDescription>
              {cascade?.kind === "group"
                ? `该大类下还有 ${cascade?.categoryCount ?? 0} 个品类、${cascade?.productCount} 个产品，删除大类将同时删除这些数据，是否继续？`
                : `该品类下还有 ${cascade?.productCount} 个产品，删除品类将同时删除这些产品，是否继续？`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCascade(null)}>
              取消
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (cascade) {
                  void doDelete(cascade.kind, cascade.id, true);
                  setCascade(null);
                }
              }}
            >
              确认级联删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
