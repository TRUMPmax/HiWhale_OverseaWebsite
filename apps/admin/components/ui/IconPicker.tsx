"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import {
  PORTAL_ICON_OPTIONS,
  isPortalIconName,
  type PortalIconName,
} from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminAuthStore } from "@/store/auth";
import { ICONS, IconGlyph, isIconUrl } from "./IconGlyph";

/** 图标选择器：网格弹窗 + 自定义上传；value 为空表示"默认"（前台回退内置图标） */
export function IconPicker({
  value,
  onChange,
  disabled,
}: {
  value?: string;
  onChange: (name: string | undefined) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  /** 上传自定义图标到 MinIO（复用 /api/uploads?kind=image，支持 svg/png/webp） */
  const uploadIcon = async (file: File) => {
    setUploading(true);
    try {
      const token = useAdminAuthStore.getState().token;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/uploads?kind=image`,
        { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd },
      );
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok || !data.url) throw new Error(data.message ?? "上传失败");
      onChange(data.url);
      setOpen(false);
      toast.success("图标已上传");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        {value ? (
          <>
            <IconGlyph value={value} className="h-4 w-4" />
            {isPortalIconName(value)
              ? (PORTAL_ICON_OPTIONS.find((o) => o.name === value)?.zh ?? value)
              : "自定义图标"}
          </>
        ) : (
          "默认图标"
        )}
      </Button>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="恢复默认"
          onClick={() => onChange(undefined)}
        >
          <X className="h-4 w-4 text-slate-400" />
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>选择图标</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {PORTAL_ICON_OPTIONS.map((opt) => {
              const Icon = ICONS[opt.name as PortalIconName];
              const active = value === opt.name;
              return (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => {
                    onChange(opt.name);
                    setOpen(false);
                  }}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-xs hover:border-blue-300 hover:bg-blue-50 ${
                    active ? "border-brand-blue bg-blue-50" : "border-slate-200"
                  }`}
                >
                  <span className="relative">
                    <Icon className="h-5 w-5 text-slate-700" />
                    {active && (
                      <Check className="text-brand-blue absolute -right-2 -top-2 h-3 w-3" />
                    )}
                  </span>
                  {opt.zh}
                </button>
              );
            })}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-medium text-slate-500">自定义图标（SVG/PNG/WebP）</p>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
                <label className="cursor-pointer">
                  {uploading ? "上传中…" : "上传图标"}
                  <input
                    type="file"
                    accept=".svg,.png,.webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) void uploadIcon(file);
                    }}
                  />
                </label>
              </Button>
              {value && isIconUrl(value) && <IconGlyph value={value} className="h-6 w-6" />}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
