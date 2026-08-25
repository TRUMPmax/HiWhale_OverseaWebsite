"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedLabel, INDUSTRY_LABELS, Industry } from "@hiwhale/shared/constants";
import type { MockCase } from "@hiwhale/shared/constants";
import { Link } from "@/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SlottedImage } from "@/components/ui/SlottedImage";

/** 案例列表：行业筛选（客户端 useState）+ 案例卡片网格（数据由服务端页面传入） */
export function CasesBrowser({ cases }: { cases: MockCase[] }) {
  const locale = useLocale();
  const t = useTranslations("cases");
  const loc = locale === "zh" ? ("zh" as const) : ("en" as const);
  const [active, setActive] = useState<Industry | "all">("all");

  const industries = Object.values(Industry);
  const filtered = active === "all" ? cases : cases.filter((c) => c.industry === active);

  const tabClass = (selected: boolean) =>
    `shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
      selected
        ? "bg-brand-blue border-brand-blue text-white"
        : "border-slate-200 bg-white text-muted hover:border-blue-300 hover:text-brand-blue"
    }`;

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 pb-2 md:flex-wrap">
            <button
              type="button"
              onClick={() => setActive("all")}
              className={tabClass(active === "all")}
            >
              {t("filters.all")}
            </button>
            {industries.map((industry) => (
              <button
                key={industry}
                type="button"
                onClick={() => setActive(industry)}
                className={tabClass(active === industry)}
              >
                {getLocalizedLabel(INDUSTRY_LABELS, industry, locale)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filtered.map((item, index) => (
            <Reveal key={item.slug} delay={index * 80} className="h-full">
              <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <SlottedImage
                    src={`/images/cases/${item.logoName}`}
                    alt={item.clientName[loc]}
                    className="aspect-[2/1] w-32 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-2"
                    placeholder={{
                      ratio: "aspect-[2/1]",
                      className: "w-32 shrink-0 rounded-lg p-2",
                      label: "客户 Logo，透明底 PNG",
                      size: "2:1 · 建议 240×120",
                      name: item.logoName,
                    }}
                  />
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    {getLocalizedLabel(INDUSTRY_LABELS, item.industry, locale)}
                  </span>
                </div>
                <h2 className="font-heading text-foreground mt-4 text-lg font-bold">
                  {item.project[loc]}
                </h2>
                <p className="text-muted mt-1 text-sm font-medium">{item.clientName[loc]}</p>
                <p className="text-muted mt-2 line-clamp-2 flex-1 text-sm leading-relaxed">
                  {item.background[loc]}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.results.slice(0, 2).map((result) => (
                    <span
                      key={result.value}
                      className="border-brand-blue/30 text-brand-blue rounded-full border px-3 py-1 text-xs font-medium"
                    >
                      {result.value} · {result.label[loc]}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/cases/${item.slug}`}
                  className="text-brand-blue mt-4 text-sm font-medium hover:underline"
                >
                  {t("readCase")} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
