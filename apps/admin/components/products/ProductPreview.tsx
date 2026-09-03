"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { PRODUCT_CATEGORY_LABELS, getLocalizedLabel } from "@hiwhale/shared/constants";
import { IconGlyph } from "@/components/ui/IconGlyph";
import { cn } from "@/lib/utils";

type Pair = { zh: string; en: string };

export type ProductPreviewData = {
  nameZh: string;
  nameEn: string;
  model: string;
  category: string;
  tagline: Pair;
  description: Pair;
  quickSpecs: Array<{ labelZh: string; labelEn: string; valueZh: string; valueEn: string }>;
  features: Array<{ zh: string; en: string; icon?: string }>;
  images: string[];
};

const FEATURE_ICON_FALLBACKS = ["zap", "shield-check", "radar", "wifi"] as const;

/** 产品详情近似预览（仿门户布局的示意渲染，非像素级还原；数据随表单实时变化） */
export function ProductPreview({ data }: { data: ProductPreviewData }) {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const zh = lang === "zh";
  const categoryLabel =
    data.category in PRODUCT_CATEGORY_LABELS
      ? getLocalizedLabel(PRODUCT_CATEGORY_LABELS, data.category, lang)
      : data.category || "—";
  const specs = data.quickSpecs.filter((s) => s.labelZh.trim() && s.valueZh.trim());
  const features = data.features.filter((f) => f.zh.trim() || f.en.trim());

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">预览（近似门户产品详情页）</span>
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

      {/* 头部：徽章 + 名称 + 型号 + 卖点 */}
      <div className="rounded-lg border border-slate-200 p-4">
        <span className="inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
          {categoryLabel}
        </span>
        <div className="mt-2 text-lg font-bold text-slate-900">
          {(zh ? data.nameZh : data.nameEn) || data.nameZh || "—"}
        </div>
        <div className="text-xs text-slate-400">{data.model || "—"}</div>
        <p className="mt-1 text-xs text-slate-500">
          {(zh ? data.tagline.zh : data.tagline.en) || data.tagline.zh || "—"}
        </p>
      </div>

      {/* 主图 */}
      {data.images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.images[0]}
          alt="产品主图"
          className="aspect-video w-full rounded-lg border border-slate-200 object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-300">
          <ImageOff className="h-8 w-8" />
          <span className="mt-1 text-xs">未上传产品图</span>
        </div>
      )}

      {/* 核心参数 */}
      {specs.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {specs.slice(0, 6).map((s, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-2 text-center">
              <div className="text-sm font-bold text-slate-900">
                {(zh ? s.valueZh : s.valueEn) || s.valueZh}
              </div>
              <div className="mt-0.5 text-xs text-slate-400">
                {(zh ? s.labelZh : s.labelEn) || s.labelZh}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 核心特性 */}
      {features.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {features.map((f, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-2.5">
              <IconGlyph
                value={f.icon || FEATURE_ICON_FALLBACKS[i % 4]}
                className="h-4 w-4 text-blue-600"
              />
              <p className="mt-1 text-xs text-slate-600">{(zh ? f.zh : f.en) || f.zh}</p>
            </div>
          ))}
        </div>
      )}

      {/* 描述 */}
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="text-xs font-bold text-slate-700">产品描述</div>
        <p className="mt-1 line-clamp-6 text-xs text-slate-500">
          {(zh ? data.description.zh : data.description.en) || data.description.zh || "—"}
        </p>
      </div>
    </div>
  );
}
