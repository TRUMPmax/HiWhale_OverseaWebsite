"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminApi } from "@/lib/api";

type RenameDialogProps = {
  /** 当前要重命名的素材 key；null 时关闭 */
  itemKey: string | null;
  onClose: () => void;
  onRenamed: () => Promise<void>;
};

/** 素材重命名：仅可改文件名（扩展名与目录锁定） */
export function RenameDialog({ itemKey, onClose, onRenamed }: RenameDialogProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const fileName = itemKey?.split("/").pop() ?? "";
  const ext = fileName.includes(".") ? `.${fileName.split(".").pop()}` : "";

  useEffect(() => {
    if (itemKey) setName(fileName.replace(/\.[^.]+$/, ""));
  }, [itemKey, fileName]);

  const submit = async () => {
    if (!itemKey || !name.trim()) return;
    setSaving(true);
    try {
      const result = await adminApi<{ key: string; updatedRefs: number }>("/api/uploads/rename", {
        method: "POST",
        body: { key: itemKey, newKey: name.trim() },
      });
      toast.success(
        `已重命名为 ${result.key.split("/").pop()}（同步引用 ${result.updatedRefs} 处）`,
      );
      await onRenamed();
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "重命名失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={itemKey !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>重命名素材</DialogTitle>
          <DialogDescription>
            仅修改文件名，扩展名 {ext} 与所在目录不变；数据库中的引用会自动同步。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>新文件名</Label>
          <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="小写字母/数字/中划线"
              onKeyDown={(e) => e.key === "Enter" && void submit()}
            />
            <span className="shrink-0 text-sm text-slate-500">{ext}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            className="bg-brand-blue hover:bg-brand-blue/90"
            disabled={saving || !name.trim()}
            onClick={() => void submit()}
          >
            {saving ? "保存中…" : "确认重命名"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
