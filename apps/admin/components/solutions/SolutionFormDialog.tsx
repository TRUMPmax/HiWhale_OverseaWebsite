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
import { useProductsStore } from "@/store/products";
import { useSolutionsStore, type AdminSolution, type Pair } from "@/store/solutions";

type SolutionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 编辑模式传入 */
  initial?: AdminSolution;
};

const pair = (): Pair => ({ zh: "", en: "" });

const EMPTY = {
  title: pair(),
  industry: "" as string,
  summary: pair(),
  description: pair(),
  duration: pair(),
  painPoints: [pair()] as Array<Pair & { icon?: string }>,
  process: [{ title: pair(), description: pair() }] as Array<{ title: Pair; description: Pair }>,
  results: [{ value: "", label: pair() }] as Array<{ value: string; label: Pair; icon?: string }>,
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

/** 方案 新增/编辑 弹窗表单（全字段双语可编辑：标题/简介/描述/痛点/部署流程/成效指标/关联产品） */
export function SolutionFormDialog({ open, onOpenChange, initial }: SolutionFormDialogProps) {
  const saveSolution = useSolutionsStore((s) => s.saveSolution);
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
              title: { zh: initial.titleZh, en: initial.titleEn },
              industry: initial.industry,
              summary: initial.summary,
              description: initial.description,
              duration: initial.duration,
              painPoints: initial.painPoints.length ? initial.painPoints : [pair()],
              process: initial.process.length
                ? initial.process
                : [{ title: pair(), description: pair() }],
              results: initial.results.length ? initial.results : [{ value: "", label: pair() }],
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
    if (!form.title.zh.trim() || !form.title.en.trim() || !form.industry) {
      toast.error("请填写标题（中/英）并选择行业");
      return;
    }
    try {
      await saveSolution(
        {
          title: { zh: form.title.zh.trim(), en: form.title.en.trim() },
          industry: form.industry,
          summary: form.summary,
          description: form.description,
          duration: form.duration,
          painPoints: form.painPoints,
          process: form.process,
          results: form.results,
          products: form.products,
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
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "编辑方案" : "新增方案"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>方案标题 *</Label>
            <PairInputs
              value={form.title}
              onChange={(v) => set("title", v)}
              placeholderZh="方案标题（中文）"
              placeholderEn="Title (English)"
            />
          </div>
          <div className="space-y-1.5">
            <Label>所属行业 *</Label>
            {/* 可选择现有行业，也可手动输入自定义行业 */}
            <Input
              list="industry-options"
              placeholder="选择或直接输入行业，如：新能源"
              value={form.industry}
              onChange={(e) => set("industry", e.target.value)}
            />
            <datalist id="industry-options">
              {Object.values(Industry).map((industry) => (
                <option key={industry} value={industry}>
                  {getLocalizedLabel(INDUSTRY_LABELS, industry, "zh")}
                </option>
              ))}
            </datalist>
            {form.industry && !(form.industry in INDUSTRY_LABELS) && (
              <p className="text-muted text-xs">自定义行业：前台将按原文展示</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>方案简介（列表卡片摘要）</Label>
            <PairInputs textarea value={form.summary} onChange={(v) => set("summary", v)} />
          </div>
          <div className="space-y-1.5">
            <Label>方案描述（详情页正文）</Label>
            <PairInputs textarea value={form.description} onChange={(v) => set("description", v)} />
          </div>
          <div className="space-y-1.5">
            <Label>交付周期</Label>
            <PairInputs
              value={form.duration}
              onChange={(v) => set("duration", v)}
              placeholderZh="如：8-12 周"
              placeholderEn="e.g. 8-12 weeks"
            />
          </div>

          {/* 行业痛点 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>行业痛点</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set("painPoints", [...form.painPoints, pair()])}
              >
                <Plus /> 添加痛点
              </Button>
            </div>
            {form.painPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <PairInputs
                  value={point}
                  onChange={(v) =>
                    set(
                      "painPoints",
                      form.painPoints.map((p, i) => (i === index ? v : p)),
                    )
                  }
                  placeholderZh="痛点（中文）"
                  placeholderEn="Pain point (EN)"
                />
                <IconPicker
                  value={point.icon}
                  onChange={(name) =>
                    set(
                      "painPoints",
                      form.painPoints.map((p, i) => (i === index ? { ...p, icon: name } : p)),
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

          {/* 部署流程 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>部署流程（时间线步骤）</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  set("process", [...form.process, { title: pair(), description: pair() }])
                }
              >
                <Plus /> 添加步骤
              </Button>
            </div>
            {form.process.map((step, index) => (
              <div key={index} className="space-y-2 rounded-lg border border-slate-100 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">步骤 {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="删除步骤"
                    className="ml-auto"
                    onClick={() =>
                      set(
                        "process",
                        form.process.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
                <PairInputs
                  value={step.title}
                  onChange={(v) =>
                    set(
                      "process",
                      form.process.map((p, i) => (i === index ? { ...p, title: v } : p)),
                    )
                  }
                  placeholderZh="步骤标题（中文）"
                  placeholderEn="Step title (EN)"
                />
                <PairInputs
                  textarea
                  value={step.description}
                  onChange={(v) =>
                    set(
                      "process",
                      form.process.map((p, i) => (i === index ? { ...p, description: v } : p)),
                    )
                  }
                  placeholderZh="步骤描述（中文）"
                  placeholderEn="Step description (EN)"
                />
              </div>
            ))}
          </div>

          {/* 成效指标 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>成效指标（大数字卡片）</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => set("results", [...form.results, { value: "", label: pair() }])}
              >
                <Plus /> 添加指标
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
                    placeholder="数值，如：+90%"
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
                    aria-label="删除指标"
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
                  placeholderZh="指标标签（中文）"
                  placeholderEn="Metric label (EN)"
                />
              </div>
            ))}
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
            <Label>场景图</Label>
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              方案场景图按素材位管理：保存方案后，到「素材管理 → 站点素材位 →
              方案」上传对应文件（文件名与方案 imageName 一致）。
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
