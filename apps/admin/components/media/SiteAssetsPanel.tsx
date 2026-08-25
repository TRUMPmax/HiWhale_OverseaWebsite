"use client";

import { useCallback, useEffect, useState } from "react";
import { ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { adminApi, API_BASE } from "@/lib/api";
import { useAdminAuthStore } from "@/store/auth";

type SiteAsset = {
  id: string;
  filename: string;
  subdir: string;
  area: string;
  purpose: string;
  exists: boolean;
  size: number;
};

/** 站点素材位面板：全量展示位（含空位）的上传/替换/删除 */
export function SiteAssetsPanel() {
  const [slots, setSlots] = useState<SiteAsset[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    const data = await adminApi<SiteAsset[]>("/api/uploads/site-assets");
    setSlots(data);
  }, []);

  useEffect(() => {
    void fetchSlots().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
  }, [fetchSlots]);

  const doUpload = async (slot: SiteAsset, file: File) => {
    setUploadingId(slot.id);
    try {
      const token = useAdminAuthStore.getState().token;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${API_BASE}/api/uploads/site-asset?slotId=${encodeURIComponent(slot.id)}`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? "上传失败");
      }
      toast.success(`${slot.purpose} 已更新`);
      await fetchSlots();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploadingId(null);
    }
  };

  const doDelete = async (slot: SiteAsset) => {
    try {
      await adminApi(`/api/uploads/site-assets/${encodeURIComponent(slot.id)}`, {
        method: "DELETE",
      });
      toast.success("已删除，恢复为占位状态");
      await fetchSlots();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    }
  };

  const areas = Array.from(new Set(slots.map((s) => s.area)));

  return (
    <div className="space-y-8">
      {areas.map((area) => (
        <div key={area}>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            {area}
            <span className="ml-2 text-xs font-normal text-slate-400">
              {slots.filter((s) => s.area === area && s.exists).length}/
              {slots.filter((s) => s.area === area).length} 已投放
            </span>
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {slots
              .filter((s) => s.area === area)
              .map((slot) => (
                <div
                  key={slot.id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  {slot.exists ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000"}/images/${slot.subdir}/${slot.filename}`}
                      alt={slot.purpose}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 bg-slate-50 p-3 text-center">
                      <ImagePlus className="h-6 w-6 text-slate-300" />
                      <span className="text-xs text-slate-400">未投放素材</span>
                    </div>
                  )}
                  <div className="space-y-1.5 p-3">
                    <div className="text-xs font-medium text-slate-700">{slot.purpose}</div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="truncate font-mono text-xs text-slate-400"
                        title={slot.filename}
                      >
                        {slot.filename}
                      </span>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {slot.subdir}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-brand-blue cursor-pointer text-xs font-medium hover:underline">
                        <input
                          type="file"
                          className="hidden"
                          disabled={uploadingId === slot.id}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void doUpload(slot, f);
                            e.target.value = "";
                          }}
                        />
                        {slot.exists ? (
                          <>
                            <RefreshCw className="mr-0.5 inline h-3 w-3" />
                            {uploadingId === slot.id ? "上传中…" : "替换"}
                          </>
                        ) : (
                          <>
                            <ImagePlus className="mr-0.5 inline h-3 w-3" />
                            {uploadingId === slot.id ? "上传中…" : "上传"}
                          </>
                        )}
                      </label>
                      {slot.exists && (
                        <button
                          type="button"
                          className="ml-auto text-xs font-medium text-red-600 hover:underline"
                          onClick={() => void doDelete(slot)}
                        >
                          <Trash2 className="mr-0.5 inline h-3 w-3" />
                          删除
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      {slots.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-400">
          加载中…
        </div>
      )}
    </div>
  );
}
