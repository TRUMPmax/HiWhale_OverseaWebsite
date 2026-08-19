"use client";

import { MutableRefObject, useEffect, useRef } from "react";

type Star = {
  /** 归一化位置 0..1 */
  x: number;
  y: number;
  /** 深度 0.3..1，越大越"近"（视差与放大更明显） */
  z: number;
  /** 基础半径 */
  r: number;
  /** 基础亮度 0..1 */
  base: number;
  /** 闪烁相位与速度 */
  phase: number;
  speed: number;
  /** 是否星辰黄 */
  yellow: boolean;
};

type StarfieldProps = {
  /** 星星密度：每平方像素数量（如 0.0006 ≈ 屏幕上数百颗） */
  density?: number;
  /** 黄色星辰占比 0..1 */
  yellowRatio?: number;
  /** 滚动进度引用 0..1：星辰随之放大外扩，模拟"远处的星辰逐渐靠近" */
  progressRef?: MutableRefObject<number>;
  /** 进度为 1 时的最大外扩倍数 */
  maxZoom?: number;
  /** 是否加光晕（终幕亮星效果） */
  glow?: boolean;
  className?: string;
};

/** 确定性伪随机（保证每次渲染星位一致） */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Canvas 程序化星野：按 devicePixelRatio 渲染（比 4K 照片更锐利），
 * 星星闪烁 + 随滚动进度"逼近"，支持品牌星辰黄。
 */
export function Starfield({
  density = 0.0006,
  yellowRatio = 0.15,
  progressRef,
  maxZoom = 1.5,
  glow = false,
  className = "",
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = mulberry32(20260819);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(24, Math.floor(w * h * density));
      stars = Array.from({ length: count }, () => ({
        x: rand(),
        y: rand(),
        z: 0.3 + rand() * 0.7,
        r: 0.4 + rand() * (glow ? 1.8 : 1.2),
        base: 0.35 + rand() * 0.65,
        phase: rand() * Math.PI * 2,
        speed: 0.4 + rand() * 1.6,
        yellow: rand() < yellowRatio,
      }));
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let raf = 0;
    const draw = (time: number) => {
      const progress = progressRef?.current ?? 0;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      for (const s of stars) {
        // 随进度外扩（从中心逼近视角）+ 半径增大
        const zoom = 1 + progress * maxZoom * s.z;
        const px = cx + (s.x * w - cx) * zoom;
        const py = cy + (s.y * h - cy) * zoom;
        if (px < -20 || px > w + 20 || py < -20 || py > h + 20) continue;

        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.001 * s.speed + s.phase);
        const alpha = Math.min(1, s.base * twinkle * (0.55 + progress * 0.6));
        const radius = s.r * (0.8 + progress * 2.4 * s.z);
        const bright = glow || s.r > 1.4;

        ctx.beginPath();
        if (s.yellow) {
          ctx.fillStyle = `rgba(255, 210, 90, ${alpha})`;
          if (bright) {
            ctx.shadowColor = "rgba(255, 200, 60, 0.9)";
            ctx.shadowBlur = radius * 5;
          }
        } else {
          ctx.fillStyle = `rgba(214, 230, 255, ${alpha})`;
          if (bright) {
            ctx.shadowColor = "rgba(170, 205, 255, 0.8)";
            ctx.shadowBlur = radius * 4;
          }
        }
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 大亮星的十字光芒
        if (bright && s.yellow && radius > 1.6) {
          ctx.strokeStyle = `rgba(255, 220, 130, ${alpha * 0.5})`;
          ctx.lineWidth = 0.6;
          const len = radius * 3;
          ctx.beginPath();
          ctx.moveTo(px - len, py);
          ctx.lineTo(px + len, py);
          ctx.moveTo(px, py - len);
          ctx.lineTo(px, py + len);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [density, yellowRatio, progressRef, maxZoom, glow]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
