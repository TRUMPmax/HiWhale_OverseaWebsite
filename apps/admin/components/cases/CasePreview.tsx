"use client";

import { useState } from "react";
import { Clock, Package, Quote } from "lucide-react";
import { getLocalizedLabel, INDUSTRY_LABELS, type Industry } from "@hiwhale/shared/constants";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { cn } from "@/lib/utils";

type Pair = { zh: string; en: string };

export type CasePreviewData = {
  clientName: Pair;
  industry: string;
  project: Pair;
  background: Pair;
  challenge: Pair;
  solution: Pair;
  duration: Pair;
  equipment: Pair[];
  results: Array<{ value: string; label: Pair; icon?: string }>;
  quote: Pair;
  author: Pair;
  role: Pair;
};

/** 案例详情近似预览（仿门户布局的示意渲染，非像素级还原；数据随表单实时变化） */
export function CasePreview({ data }: { data: CasePreviewData }) {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const pick = (p: Pair) => p[lang] || p[lang === "zh" ? "en" : "zh"] || "—";
  const industryLabel =
    data.industry in INDUSTRY_LABELS
      ? getLocalizedLabel(INDUSTRY_LABELS, data.industry as Industry, lang)
      : data.industry || "—";
  const results = data.results.filter((r) => r.value.trim() || r.label.zh.trim());
  const equipment = data.equipment.filter((e) => e.zh.trim() || e.en.trim());

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">预览（近似门户案例详情页）</span>
        <div className="flex gap-1">
          {(["zh", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={cn(
                "rounded px-2 py-0.5 text-xs",
                lang === l ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500",
              )}
            >
              {l === "zh" ? "中文" : "EN"}
            </button>
          ))}
        </div>
      </div>

      {/* 头部 */}
      <div className="rounded-lg border border-slate-200 p-4">
        <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
          {industryLabel}
        </span>
        <div className="mt-2 text-lg font-bold text-slate-900">{pick(data.project)}</div>
        <div className="text-xs text-slate-500">{pick(data.clientName)}</div>
      </div>

      {/* 背景 / 挑战 / 方案 */}
      <div className="grid grid-cols-3 gap-2">
        {(
          [
            ["项目背景", data.background],
            ["挑战", data.challenge],
            ["解决方案", data.solution],
          ] as const
        ).map(([title, p]) => (
          <div key={title} className="rounded-lg border border-slate-200 p-2.5">
            <div className="text-xs font-bold text-slate-700">{title}</div>
            <div className="mt-1 line-clamp-4 text-xs text-slate-500">{pick(p)}</div>
          </div>
        ))}
      </div>

      {/* 设备 + 交付周期 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Package className="h-3.5 w-3.5 text-blue-600" /> 投入设备
          </div>
          <ul className="mt-2 space-y-1">
            {equipment.length === 0 && <li className="text-xs text-slate-400">—</li>}
            {equipment.map((e, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-500">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                {pick(e)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 p-3 text-center">
          <Clock className="h-5 w-5 text-blue-600" />
          <div className="mt-1 text-base font-bold text-blue-700">{pick(data.duration)}</div>
          <div className="text-xs text-slate-400">交付周期</div>
        </div>
      </div>

      {/* 成果指标 */}
      {results.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {results.map((r, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-2.5 text-center">
              <IconGlyph value={r.icon} className="mx-auto mb-1 h-4 w-4 text-blue-600" />
              <div className="text-sm font-bold text-blue-700">{r.value || "—"}</div>
              <div className="mt-0.5 text-xs text-slate-400">{pick(r.label)}</div>
            </div>
          ))}
        </div>
      )}

      {/* 客户证言 */}
      <div className="rounded-lg border border-slate-200 p-3">
        <Quote className="h-4 w-4 text-blue-600" />
        <p className="mt-1 text-xs text-slate-600">{pick(data.quote)}</p>
        <div className="mt-2 text-xs">
          <span className="font-medium text-slate-700">{pick(data.author)}</span>
          <span className="ml-2 text-slate-400">{pick(data.role)}</span>
        </div>
      </div>
    </div>
  );
}
