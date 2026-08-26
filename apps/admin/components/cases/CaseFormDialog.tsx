"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { useCasesStore, type AdminCase } from "@/store/cases";
import { useProductsStore } from "@/store/products";

type CaseFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: AdminCase;
};

const EMPTY = {
  clientName: "",
  industry: "" as string,
  project: "",
  background: "",
  challenge: "",
  solution: "",
  results: [{ value: "", label: "" }] as Array<{ value: string; label: string }>,
  quote: "",
  author: "",
  role: "",
  products: [] as string[],
};

/** 案例 新增/编辑 弹窗表单 */
export function CaseFormDialog({ open, onOpenChange, initial }: CaseFormDialogProps) {
  const saveCase = useCasesStore((s) => s.saveCase);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open && products.length === 0) {
      void fetchProducts().catch(() => toast.error("产品列表加载失败，已回退到内置数据"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              clientName: initial.clientName,
              industry: initial.industry,
              project: initial.project,
              background: initial.background,
              challenge: initial.challenge,
              solution: initial.solution,
              results: initial.results.length ? initial.results : [{ value: "", label: "" }],
              quote: initial.testimonial.quote,
              author: initial.testimonial.author,
              role: initial.testimonial.role,
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
    if (!form.clientName.trim() || !form.industry || !form.project.trim()) {
      toast.error("请填写客户名、行业与项目名");
      return;
    }
    const payload = {
      clientName: form.clientName.trim(),
      industry: form.industry as Industry,
      project: form.project.trim(),
      background: form.background,
      challenge: form.challenge,
      solution: form.solution,
      results: form.results.filter((r) => r.value.trim() || r.label.trim()),
      testimonial: { quote: form.quote, author: form.author, role: form.role },
      products: form.products,
    };
    try {
      await saveCase(payload, initial?.id);
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
          <DialogTitle>{initial ? "编辑案例" : "新增案例"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>客户名称 *</Label>
              <Input value={form.clientName} onChange={(e) => set("clientName", e.target.value)} />
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
          </div>
          <div className="space-y-1.5">
            <Label>项目名 *</Label>
            <Input value={form.project} onChange={(e) => set("project", e.target.value)} />
          </div>
          {(
            [
              ["background", "项目背景"],
              ["challenge", "挑战"],
              ["solution", "解决方案"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Textarea rows={3} value={form[key]} onChange={(e) => set(key, e.target.value)} />
            </div>
          ))}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>成果数据</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set("results", [...form.results, { value: "", label: "" }])}
              >
                <Plus /> 添加数据
              </Button>
            </div>
            {form.results.map((result, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="数值，如：+180%"
                  value={result.value}
                  onChange={(e) =>
                    set(
                      "results",
                      form.results.map((r, i) =>
                        i === index ? { ...r, value: e.target.value } : r,
                      ),
                    )
                  }
                />
                <Input
                  placeholder="标签，如：峰值吞吐提升"
                  value={result.label}
                  onChange={(e) =>
                    set(
                      "results",
                      form.results.map((r, i) =>
                        i === index ? { ...r, label: e.target.value } : r,
                      ),
                    )
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="删除数据"
                  onClick={() =>
                    set(
                      "results",
                      form.results.filter((_, i) => i !== index),
                    )
                  }
                >
                  <Trash2 className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label>客户评价</Label>
            <Textarea
              rows={2}
              placeholder="评价内容"
              value={form.quote}
              onChange={(e) => set("quote", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="评价人"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
              />
              <Input
                placeholder="职务"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>关联产品</Label>
            <div className="grid grid-cols-2 gap-2">
              {(products.length > 0 ? products : MOCK_PRODUCTS).map((p) => (
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
            <Label>客户 Logo</Label>
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              案例现场图与客户 Logo 按素材位管理：保存案例后，到「素材管理 → 站点素材位 →
              案例」上传对应文件。
            </p>
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
