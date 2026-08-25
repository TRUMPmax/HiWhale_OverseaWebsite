"use client";

import { useEffect, useState } from "react";
import { Copy, FileText, Images, Package, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { adminApi, API_BASE } from "@/lib/api";
import { useAdminAuthStore } from "@/store/auth";

type MediaItem = {
  key: string;
  url: string;
  size: number;
  lastModified: string;
  kind: string;
};

const KIND_TABS = [
  { value: "", label: "全部" },
  { value: "image", label: "图片" },
  { value: "spec", label: "文档" },
  { value: "model", label: "模型" },
];

const PAGE_SIZE = 12;

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function kindOf(item: MediaItem): "image" | "spec" | "model" | "doc" | "other" {
  if (["image", "spec", "model", "doc"].includes(item.kind)) {
    return item.kind as "image" | "spec" | "model" | "doc";
  }
  return "other";
}

/** 素材管理：全站上传素材的浏览 / 上传 / 替换 / 删除 / 复制链接 */
export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [kind, setKind] = useState("");
  const [search, setSearch] = useState("");
  const [uploadKind, setUploadKind] = useState("image");
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);

  const fetchItems = async () => {
    const data = await adminApi<{ items: MediaItem[]; total: number }>(
      `/api/uploads?page=${page}&pageSize=${PAGE_SIZE}${kind ? `&prefix=${kind}/` : ""}`,
    );
    setItems(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    void fetchItems().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, kind]);

  const filtered = search.trim()
    ? items.filter((i) => i.key.toLowerCase().includes(search.trim().toLowerCase()))
    : items;

  const doUpload = async (files: FileList, targetKind: string, targetKey?: string) => {
    setUploading(true);
    try {
      const token = useAdminAuthStore.getState().token;
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(
          `${API_BASE}/api/uploads?kind=${targetKind}${targetKey ? `&key=${encodeURIComponent(targetKey)}` : ""}`,
          { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd },
        );
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { message?: string };
          throw new Error(data.message ?? `上传失败：${file.name}`);
        }
      }
      toast.success(targetKey ? "替换成功" : "上传成功");
      await fetchItems();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const doDelete = async (item: MediaItem) => {
    try {
      await adminApi("/api/uploads", { method: "DELETE", body: { key: item.key } });
      toast.success("已删除");
      await fetchItems();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    }
  };

  const copyLink = (url: string) => {
    void navigator.clipboard
      .writeText(url)
      .then(() => toast.success("链接已复制"))
      .catch(() => toast.error("复制失败"));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="素材管理"
        description="全站上传素材（MinIO）的浏览、替换与删除"
        action={
          <div className="flex items-center gap-3">
            <select
              className="border-input bg-background focus:border-brand-blue flex h-9 rounded-md border px-3 text-sm outline-none"
              value={uploadKind}
              onChange={(e) => setUploadKind(e.target.value)}
            >
              <option value="image">图片</option>
              <option value="spec">文档</option>
              <option value="model">模型</option>
            </select>
            <label className="bg-brand-blue hover:bg-brand-blue/90 inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity">
              <input
                type="file"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  if (e.target.files?.length) void doUpload(e.target.files, uploadKind);
                  e.target.value = "";
                }}
              />
              <Upload className="h-4 w-4" />
              {uploading ? "上传中…" : "上传素材"}
            </label>
          </div>
        }
      />

      {/* 工具栏 */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {KIND_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setKind(tab.value);
                setPage(1);
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                kind === tab.value ? "bg-brand-blue text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="搜索文件名…"
            className="w-64 pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 素材网格 */}
      <div className="grid grid-cols-4 gap-4">
        {filtered.map((item) => {
          const itemKind = kindOf(item);
          const isImage = itemKind === "image";
          return (
            <div
              key={item.key}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.key} className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-slate-50 p-4">
                  {itemKind === "model" ? (
                    <Package className="h-8 w-8 text-slate-400" />
                  ) : (
                    <FileText className="h-8 w-8 text-slate-400" />
                  )}
                  <span className="w-full truncate text-center font-mono text-xs text-slate-500">
                    {item.key.split("/").pop()}
                  </span>
                </div>
              )}
              <div className="space-y-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-mono text-xs text-slate-600" title={item.key}>
                    {item.key.split("/").pop()}
                  </span>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {item.kind}
                  </Badge>
                </div>
                <div className="text-xs text-slate-400">
                  {formatSize(item.size)} · {item.lastModified.slice(0, 10)}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <label className="text-brand-blue cursor-pointer text-xs font-medium hover:underline">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          void doUpload(
                            e.target.files,
                            itemKind === "other" ? "image" : itemKind,
                            item.key,
                          );
                        }
                        e.target.value = "";
                      }}
                    />
                    <RefreshCw className="mr-0.5 inline h-3 w-3" />
                    替换
                  </label>
                  <button
                    type="button"
                    className="hover:text-brand-blue text-xs font-medium text-slate-500"
                    onClick={() => copyLink(item.url)}
                  >
                    <Copy className="mr-0.5 inline h-3 w-3" />
                    复制链接
                  </button>
                  <button
                    type="button"
                    className="ml-auto text-xs font-medium text-red-600 hover:underline"
                    onClick={() => setPendingDelete(item)}
                  >
                    <Trash2 className="mr-0.5 inline h-3 w-3" />
                    删除
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
            <Images className="mr-2 h-5 w-5" /> 暂无素材
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <Pagination total={total} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
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
              删除素材「{pendingDelete?.key.split("/").pop()}
              」后，引用该文件的位置将显示为失效链接。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              取消
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (pendingDelete) void doDelete(pendingDelete);
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
