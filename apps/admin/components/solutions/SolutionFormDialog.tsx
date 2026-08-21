"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  getLocalizedLabel,
  INDUSTRY_LABELS,
  Industry,
  MOCK_PRODUCTS,
} from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSolutionsStore, type AdminSolution } from "@/store/solutions";

type SolutionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 编辑模式传入 */
  initial?: AdminSolution;
};

const EMPTY = {
  titleZh: "",
  titleEn: "",
  industry: "" as string,
  summary: "",
  painPoints: [""] as string[],
  products: [] as string[],
};

/** 方案 新增/编辑 弹窗表单 */
export function SolutionFormDialog({ open, onOpenChange, initial }: SolutionFormDialogProps) {
  const saveSolution = useSolutionsStore((s) => s.saveSolution);

  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              titleZh: initial.titleZh,
              titleEn: initial.titleEn,
              industry: initial.industry,
              summary: initial.summary,
              painPoints: initial.painPoints.length ? initial.painPoints : [""],
              products: initial.products,
            }
          : EMPTY,
      );
    }
  }, [open, initial]);

  const set = <K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleProduct = (slug: string) =>
    set(
      "products",
      form.products.includes(slug)
        ? form.products.filter((s) => s !== slug)
        : [...form.products, slug],
    );

  const submit = async () => {
    if (!form.titleZh.trim() || !form.titleEn.trim() || !form.industry) {
      toast.error("请填写标题（中/英）并选择行业");
      return;
    }
    const payload = {
      titleZh: form.titleZh.trim(),
      titleEn: form.titleEn.trim(),
      industry: form.industry as Industry,
      summary: form.summary.trim(),
      painPoints: form.painPoints.map((p) => p.trim()).filter(Boolean),
      products: form.products,
    };
    try {
      await saveSolution(payload, initial?.id);
      toast.success("保存成功");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
      return;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "编辑方案" : "新增方案"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>方案标题（中文）*</Label>
              <Input value={form.titleZh} onChange={(e) => set("titleZh", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>方案标题（英文）*</Label>
              <Input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>所属行业 *</Label>
            <select
              className="border-input bg-background focus:border-brand-blue flex h-9 w-full rounded-md border px-3 text-sm outline-none"
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
            >
              <option value="">请选择行业</option>
              {Object.values(Industry).map((industry) => (
                <option key={industry} value={industry}>
                  {getLocalizedLabel(INDUSTRY_LABELS, industry, "zh")}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>方案简介</Label>
            <Textarea
              rows={3}
              value={form.summary}
              onChange={(e) => set("summary", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>行业痛点</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set("painPoints", [...form.painPoints, ""])}
              >
                <Plus /> 添加痛点
              </Button>
            </div>
            {form.painPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={point}
                  placeholder="痛点描述"
                  onChange={(e) =>
                    set(
                      "painPoints",
                      form.painPoints.map((p, i) => (i === index ? e.target.value : p)),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="删除痛点"
                  onClick={() =>
                    set(
                      "painPoints",
                      form.painPoints.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>关联产品</Label>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_PRODUCTS.map((p) => (
                <label
                  key={p.slug}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                >
                  <input
                    type="checkbox"
                    className="accent-brand-blue h-4 w-4"
                    checked={form.products.includes(p.slug)}
                    onChange={() => toggleProduct(p.slug)}
                  />
                  {p.name.zh}（{p.model}）
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>场景图</Label>
            <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 text-center">
              <Upload className="h-6 w-6 text-slate-400" />
              <span className="text-xs text-slate-500">
                点击或拖拽上传方案场景图（占位，后端就绪后接 MinIO）
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={submit}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
