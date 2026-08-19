"use client";

import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import {
  getLocalizedLabel,
  INDUSTRY_LABELS,
  Industry,
  PRODUCT_CATEGORY_LABELS,
  ProductCategory,
} from "@hiwhale/shared/constants";
import { CATEGORY_IMAGE_NAMES, INDUSTRY_IMAGE_NAMES } from "./assets";

/** 产品芯片的景深层次（translateZ） */
const CHIP_DEPTHS = [0, 60, 20, 80, 40, 10];

/** 数值指标（第 4 个 24/7 为静态文本，不参与滚动计数） */
const METRICS = [
  { key: "projects", end: 500, suffix: "+", decimals: 0 },
  { key: "countries", end: 30, suffix: "+", decimals: 0 },
  { key: "uptime", end: 99.9, suffix: "%", decimals: 1 },
] as const;

/** 视差层与跟随深度（±px） */
const PARALLAX_LAYERS: Array<[string, number]> = [
  [".np-bg", 5],
  [".np-products", 10],
  [".np-scenes", 14],
  [".np-data", 18],
];

/**
 * 首页 Hero 滚轮叙事（桌面端，400vh pin）：
 * 0-15% 产品家族上浮 → 15-45% 行业场景上浮 → 45-75% 数据指标 → 75-100% 深蓝幕布收尾
 * 移动端不渲染（由静态 Hero 替代）
 */
export function HeroNarrative() {
  const t = useTranslations("home");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const metricRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const categories = Object.values(ProductCategory);
  const industries = Object.values(Industry);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const q = (sel: string) => container.querySelectorAll(sel);

      // 初始状态
      gsap.set(q(".np-title, .np-subtitle"), { opacity: 0, y: 30 });
      gsap.set(q(".np-chip"), { opacity: 0, y: 80 });
      gsap.set(q(".ns-card"), { opacity: 0, y: 120, scale: 0.9 });
      gsap.set(q(".np-data-inner"), { opacity: 0, y: 40 });
      gsap.set(q(".np-curtain"), { yPercent: 100 });
      gsap.set(q(".np-curtain-logo"), { scale: 1.2 });
      gsap.set(q(".np-curtain-text"), { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: stage,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      // 第一幕 0-15%：标题 + 产品家族从底部上浮
      tl.to(q(".np-title"), { opacity: 1, y: 0, duration: 0.05 }, 0);
      tl.to(q(".np-subtitle"), { opacity: 1, y: 0, duration: 0.05 }, 0.02);
      tl.to(q(".np-chip"), { opacity: 1, y: 0, duration: 0.08, stagger: 0.015 }, 0.03);

      // 第二幕 15-45%：产品退居背景，6 个行业场景逐个上浮
      tl.to(q(".np-head"), { opacity: 0, y: -30, duration: 0.05 }, 0.15);
      tl.to(q(".np-hint"), { opacity: 0, duration: 0.04 }, 0.15);
      tl.to(q(".np-products-inner"), { opacity: 0.25, scale: 0.85, y: -60, duration: 0.1 }, 0.15);
      tl.to(q(".ns-card"), { opacity: 1, y: 0, scale: 1, duration: 0.08, stagger: 0.05 }, 0.15);

      // 第三幕 45-75%：场景向两侧散开，数据指标进入并 CountUp
      tl.to(
        q(".ns-card"),
        {
          opacity: 0,
          x: (index: number) => ((index % 3) - 1) * 240,
          y: (index: number) => (index < 3 ? -120 : 120),
          duration: 0.1,
          stagger: 0.01,
        },
        0.45,
      );
      tl.to(q(".np-products-inner"), { opacity: 0, duration: 0.08 }, 0.45);
      tl.to(q(".np-data-inner"), { opacity: 1, y: 0, duration: 0.08 }, 0.5);

      const counters = METRICS.map(() => ({ value: 0 }));
      METRICS.forEach((m, i) => {
        tl.to(
          counters[i],
          {
            value: m.end,
            duration: 0.18,
            ease: "power1.out",
            onUpdate: () => {
              const el = metricRefs.current[i];
              if (el) el.textContent = counters[i].value.toFixed(m.decimals) + m.suffix;
            },
          },
          0.52,
        );
      });

      // 第四幕 75-100%：深蓝幕布上升，Logo 收缩居中收尾
      tl.to(q(".np-data-inner"), { opacity: 0, scale: 0.95, duration: 0.06 }, 0.75);
      tl.to(q(".np-curtain"), { yPercent: 0, duration: 0.18, ease: "power2.inOut" }, 0.76);
      tl.to(q(".np-curtain-logo"), { scale: 1, duration: 0.14 }, 0.84);
      tl.to(q(".np-curtain-text"), { opacity: 1, y: 0, duration: 0.08, stagger: 0.03 }, 0.9);

      // 鼠标视差：各层按深度 ±px 跟随
      const parallax = PARALLAX_LAYERS.map(([sel, depth]) => {
        const el = container.querySelector(sel);
        if (!el) return null;
        return {
          depth,
          x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }),
        };
      });
      const onMouseMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        parallax.forEach((p) => {
          if (!p) return;
          p.x(nx * 2 * p.depth);
          p.y(ny * 2 * p.depth);
        });
      };
      stage.addEventListener("mousemove", onMouseMove);

      // "Scroll to explore" 呼吸动画
      const pulse = gsap.to(q(".np-hint-icon"), {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "sine.inOut",
      });

      return () => {
        stage.removeEventListener("mousemove", onMouseMove);
        pulse.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative hidden h-[400vh] md:block">
      <div
        ref={stageRef}
        className="bg-brand-navy h-screen w-full overflow-hidden text-white"
        style={{ perspective: "1200px" }}
      >
        {/* 背景层：细网格装饰线 */}
        <div
          className="np-bg absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        />

        {/* 产品层：标题 + 全品类产品家族色块 */}
        <div
          className="np-products pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="np-head flex flex-col items-center text-center">
            <h1 className="np-title font-heading max-w-3xl text-4xl font-bold leading-tight lg:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="np-subtitle mt-4 max-w-xl text-lg text-white/70">{t("hero.subtitle")}</p>
          </div>
          <div
            className="np-products-inner mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-4"
            style={{ transformStyle: "preserve-3d" }}
          >
            {categories.map((category, i) => (
              <div
                key={category}
                className="np-chip w-28 lg:w-36"
                style={{ transform: `translateZ(${CHIP_DEPTHS[i]}px)` }}
              >
                <div className="border-brand-blue/40 bg-brand-blue/20 flex aspect-[4/3] flex-col items-center justify-center rounded-xl border p-2">
                  <span className="text-center text-xs font-medium">
                    {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, locale)}
                  </span>
                  <span className="mt-1 font-mono text-[0.625rem] text-white/60">
                    {CATEGORY_IMAGE_NAMES[category]}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="np-hint absolute bottom-8 flex flex-col items-center gap-2 text-sm text-white/60">
            <span>{t("narrative.scrollHint")}</span>
            <ChevronDown className="np-hint-icon h-5 w-5" />
          </div>
        </div>

        {/* 场景层：6 个行业场景卡片（3×2） */}
        <div className="np-scenes pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <div className="grid w-full max-w-5xl grid-cols-3 gap-5">
            {industries.map((industry) => (
              <div key={industry} className="ns-card text-foreground rounded-xl bg-white p-4">
                <div className="border-brand-blue/40 bg-brand-blue/10 flex aspect-video flex-col items-center justify-center rounded-lg border p-2">
                  <span className="text-brand-blue font-mono text-[0.625rem]">
                    {INDUSTRY_IMAGE_NAMES[industry]}
                  </span>
                </div>
                <h3 className="font-heading mt-3 text-sm font-bold">
                  {getLocalizedLabel(INDUSTRY_LABELS, industry, locale)}
                </h3>
                <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {t(`industries.items.${industry}.painPoint`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 数据层：理念文字 + 4 个指标 */}
        <div className="np-data pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <div className="np-data-inner grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">
                {t("narrative.dataTitle")}
              </h2>
              <p className="mt-4 leading-relaxed text-white/70">{t("narrative.dataText")}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {METRICS.map((m, i) => (
                <div
                  key={m.key}
                  className="rounded-xl border border-white/15 bg-white/5 p-6 text-center"
                >
                  <span
                    ref={(el) => {
                      metricRefs.current[i] = el;
                    }}
                    className="font-heading text-4xl font-bold"
                  >
                    {(0).toFixed(m.decimals) + m.suffix}
                  </span>
                  <div className="mt-2 text-sm text-white/60">
                    {t(`stats.items.${m.key}.label`)}
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-white/15 bg-white/5 p-6 text-center">
                <span className="font-heading text-4xl font-bold">24/7</span>
                <div className="mt-2 text-sm text-white/60">{t("narrative.supportLabel")}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 幕布层：深蓝收尾 + Logo */}
        <div className="np-curtain absolute inset-0 flex flex-col items-center justify-center bg-[#061529]">
          <div className="np-curtain-logo font-heading text-5xl font-bold tracking-tight md:text-7xl">
            HiWhale <span className="text-brand-blue">Robotics</span>
            <sup className="text-2xl">™</sup>
          </div>
          <p className="np-curtain-text mt-6 text-white/60">{t("narrative.curtainTagline")}</p>
          <div className="np-curtain-text mt-10 flex flex-col items-center gap-2">
            <span className="text-lg font-medium">{t("narrative.curtainCta")}</span>
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
