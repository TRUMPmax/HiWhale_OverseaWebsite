"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import type { CompanyAbout } from "./types";

const DEFAULT_CERTS = ["CE", "ISO 9001", "ISO 3691-4", "ISO 13849", "UL"];

/** 合作伙伴 Logo 槽位（后台素材管理 → 站点素材位 → 关于我们，partner-logo-01~31） */
const LOGO_COUNT = 31;
const LOGOS = Array.from(
  { length: LOGO_COUNT },
  (_, i) => `/images/about/partners/partner-logo-${String(i + 1).padStart(2, "0")}.png`,
);
const ROW1 = LOGOS.slice(0, Math.ceil(LOGO_COUNT / 2));
const ROW2 = LOGOS.slice(Math.ceil(LOGO_COUNT / 2));

/** 单个 Logo：文件被后台删除/未投放时自动隐藏（不占轮播位） */
function LogoImg({ src, onMissing }: { src: string; onMissing: (src: string) => void }) {
  return (
    <div className="flex h-20 w-40 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="合作伙伴 Logo"
        loading="lazy"
        className="max-h-full max-w-full object-contain"
        onError={() => onMissing(src)}
      />
    </div>
  );
}

function LogoRow({
  logos,
  reverse,
  missing,
  onMissing,
}: {
  logos: string[];
  reverse?: boolean;
  missing: Set<string>;
  onMissing: (src: string) => void;
}) {
  const visible = logos.filter((src) => !missing.has(src));
  if (visible.length === 0) return null;
  // 列表渲染两遍实现无缝循环
  const doubled = [...visible, ...visible];
  return (
    <div className="marquee-row relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={`marquee-track gap-6 ${reverse ? "reverse" : ""}`}>
        {doubled.map((src, i) => (
          <LogoImg key={`${src}-${i}`} src={src} onMissing={onMissing} />
        ))}
      </div>
    </div>
  );
}

/** 关于我们 6：合作伙伴（双排反向轮播，素材位驱动）+ 认证（认证列表可来自公司数据中台） */
export function Partners({ data }: { data?: CompanyAbout | null }) {
  const t = useTranslations("about.partners");
  const certs =
    data?.certifications && data.certifications.length > 0 ? data.certifications : DEFAULT_CERTS;
  const [missing, setMissing] = useState<Set<string>>(new Set());

  const onMissing = (src: string) =>
    setMissing((prev) => (prev.has(src) ? prev : new Set(prev).add(src)));

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <Reveal>
          <h2 className="font-heading text-foreground text-2xl font-bold md:text-3xl">
            {t("title")}
          </h2>
        </Reveal>
        <div className="mt-8 space-y-6">
          <LogoRow logos={ROW1} missing={missing} onMissing={onMissing} />
          <LogoRow logos={ROW2} reverse missing={missing} onMissing={onMissing} />
        </div>
        <Reveal>
          <h3 className="font-heading text-foreground mt-10 text-lg font-bold">
            {t("certsTitle")}
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {certs.map((cert) => (
              <span
                key={cert}
                className="text-muted rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
