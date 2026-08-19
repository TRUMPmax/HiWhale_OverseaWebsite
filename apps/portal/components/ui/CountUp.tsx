"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type CountUpProps = {
  /** 目标数值 */
  end: number;
  /** 后缀，如 "+"、"%"、"M+" */
  suffix?: string;
  /** 小数位数 */
  decimals?: number;
  /** 动画时长（秒） */
  duration?: number;
  className?: string;
};

/** 数字滚动动画：进入视口后从 0 递增到目标值 */
export function CountUp({ end, suffix = "", decimals = 0, duration = 2, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const counter = { value: 0 };
    let tween: gsap.core.Tween | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          tween = gsap.to(counter, {
            value: end,
            duration,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = counter.value.toFixed(decimals) + suffix;
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [end, suffix, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {(0).toFixed(decimals) + suffix}
    </span>
  );
}
