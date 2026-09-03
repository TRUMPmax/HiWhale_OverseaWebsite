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
import { IconPicker } from "@/components/ui/IconPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCasesStore, type AdminCase } from "@/store/cases";
import { CasePreview } from "./CasePreview";
import { useProductsStore } from "@/store/products";
import type { Pair } from "@/store/solutions";

type CaseFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 编辑模式传入 */
  initial?: AdminCase;
};

const pair = (): Pair => ({ zh: "", en: "" });

const EMPTY = {
  clientName: pair(),
  industry: "" as string,
  project: pair(),
  background: pair(),
  challenge: pair(),
  solution: pair(),
  duration: pair(),
  equipment: [pair()] as Pair[],
  results: [{ value: "", label: pair() }] as Array<{ value: string; label: Pair; icon?: string }>,
  quote: pair(),
  author: pair(),
  role: pair(),
  products: [] as string[],
};

/** 双语字段行（中/英并排） */
function PairInputs({
  value,
  onChange,
  textarea,
  placeholderZh,
  placeholderEn,
}: {
  value: Pair;
  onChange: (v: Pair) => void;
  textarea?: boolean;
  placeholderZh?: string;
  placeholderEn?: string;
}) {
  const Cmp = textarea ? Textarea : Input;
  return (
    <div className="grid flex-1 grid-cols-2 gap-2">
      <Cmp
        placeholder={placeholderZh ?? "中文"}
        value={value.zh}
        onChange={(e) => onChange({ ...value, zh: e.target.value })}
      />
      <Cmp
        placeholder={placeholderEn ?? "English"}
        value={value.en}
        onChange={(e) => onChange({ ...value, en: e.target.value })}
      />
    </div>
  );
}

/** 案例 新增/编辑 弹窗表单（全字段双语可编辑：客户/项目/背景/挑战/方案/交付周期/设备清单/成果/证言/关联产品） */
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
              clientName: { zh: initial.clientName, en: initial.clientNameEn },
              industry: initial.industry as string,
              project: { zh: initial.project, en: initial.projectEn },
              background: initial.background,
              challenge: initial.challenge,
              solution: initial.solution,
              duration: initial.duration,
              equipment: initial.equipment.length ? initial.equipment : [pair()],
              results: initial.results.length ? initial.results : [{ value: "", label: pair() }],
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
    if (!form.clientName.zh.trim() || !form.industry || !form.project.zh.trim()) {
      toast.error("请填写客户名、行业与项目名（中文）");
      return;
    }
    try {
      await saveCase(
        {
          clientNamePair: form.clientName,
          projectPair: form.project,
          industry: form.industry,
          background: form.background,
          challenge: form.challenge,
          solution: form.solution,
          duration: form.duration,
          equipment: form.equipment,
          results: form.results,
          testimonial: { quote: form.quote, author: form.author, role: form.role },
          products: form.products,
          clientNameEn: "",
          projectEn: "",
        },
        initial?.id,
      );
      toast.success("保存成功");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
      return;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-6xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{initial ? "编辑案例" : "新增案例"}</DialogTitle>
        </DialogHeader>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-6">
          <div className="space-y-4 overflow-y-auto pr-2">
            <div className="grid grid-cols-[1fr_14rem] gap-4">
              <div className="space-y-1.5">
                <Label>客户名称 *</Label>
                <PairInputs
                  value={form.clientName}
                  onChange={(v) => set("clientName", v)}
                  placeholderZh="客户名称（中文）"
                  placeholderEn="Client name (EN)"
                />
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
              <PairInputs
                value={form.project}
                onChange={(v) => set("project", v)}
                placeholderZh="项目名（中文）"
                placeholderEn="Project name (EN)"
              />
            </div>
            <div className="space-y-1.5">
              <Label>交付周期</Label>
              <PairInputs
                value={form.duration}
                onChange={(v) => set("duration", v)}
                placeholderZh="如：4 个月"
                placeholderEn="e.g. 4 months"
              />
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
                <PairInputs textarea value={form[key]} onChange={(v) => set(key, v)} />
              </div>
            ))}

            {/* 设备清单 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>设备清单（文字列表）</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("equipment", [...form.equipment, pair()])}
                >
                  <Plus /> 添加设备
                </Button>
              </div>
              {form.equipment.map((equipment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <PairInputs
                    value={equipment}
                    onChange={(v) =>
                      set(
                        "equipment",
                        form.equipment.map((e, i) => (i === index ? v : e)),
                      )
                    }
                    placeholderZh="设备（中文）"
                    placeholderEn="Equipment (EN)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="删除设备"
                    onClick={() =>
                      set(
                        "equipment",
                        form.equipment.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              ))}
            </div>

            {/* 成果数据 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>成果数据</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("results", [...form.results, { value: "", label: pair() }])}
                >
                  <Plus /> 添加数据
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                回本周期/ROI 作为一项指标在此维护（数值如 2.1 yrs，标签填「投资回收期 / Payback
                Period」）；图标留空则前台不显示图标。
              </p>
              {form.results.map((result, index) => (
                <div key={index} className="space-y-2 rounded-lg border border-slate-100 p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="数值，如：+180%"
                      className="w-40"
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
                    <IconPicker
                      value={result.icon}
                      onChange={(name) =>
                        set(
                          "results",
                          form.results.map((r, i) => (i === index ? { ...r, icon: name } : r)),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="删除数据"
                      className="ml-auto"
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
                  <PairInputs
                    value={result.label}
                    onChange={(v) =>
                      set(
                        "results",
                        form.results.map((r, i) => (i === index ? { ...r, label: v } : r)),
                      )
                    }
                    placeholderZh="标签，如：峰值吞吐提升"
                    placeholderEn="Label (EN)"
                  />
                </div>
              ))}
            </div>

            {/* 客户证言 */}
            <div className="space-y-2">
              <Label>客户评价</Label>
              <PairInputs
                textarea
                value={form.quote}
                onChange={(v) => set("quote", v)}
                placeholderZh="评价内容（中文）"
                placeholderEn="Quote (EN)"
              />
              <div className="grid grid-cols-2 gap-2">
                <PairInputs
                  value={form.author}
                  onChange={(v) => set("author", v)}
                  placeholderZh="评价人（中文）"
                  placeholderEn="Author (EN)"
                />
                <PairInputs
                  value={form.role}
                  onChange={(v) => set("role", v)}
                  placeholderZh="职务（中文）"
                  placeholderEn="Role (EN)"
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
          <div className="overflow-y-auto rounded-lg bg-slate-50 p-4">
            <CasePreview data={form} />
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
