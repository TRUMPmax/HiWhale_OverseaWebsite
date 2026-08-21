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
  /** 是否带十字光芒的亮星 */
  flare: boolean;
};

type StarfieldProps = {
  /** 星星密度：每平方像素数量（如 0.0005 ≈ 全屏数百颗） */
  density?: number;
  /** 黄色星辰占比 0..1 */
  yellowRatio?: number;
  /** 滚动进度引用 0..1：星辰随之放大外扩，模拟"远处的星辰逐渐靠近" */
  progressRef?: MutableRefObject<number>;
  /** 进度为 1 时的最大外扩倍数 */
  maxZoom?: number;
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

/** 预渲染星光贴图（径向渐变光点 + 可选十字光芒），drawImage 比 arc+shadowBlur 快几个数量级 */
function makeStarSprite(inner: string, mid: string, withFlare: boolean): HTMLCanvasElement {
  const size = 96;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (!g) return c;

  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.22, mid);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);

  if (withFlare) {
    g.globalCompositeOperation = "lighter";
    const flare = (horizontal: boolean) => {
      const lg = horizontal
        ? g.createLinearGradient(0, size / 2, size, size / 2)
        : g.createLinearGradient(size / 2, 0, size / 2, size);
      lg.addColorStop(0, "rgba(0,0,0,0)");
      lg.addColorStop(0.5, mid);
      lg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = lg;
      if (horizontal) g.fillRect(0, size / 2 - 1, size, 2);
      else g.fillRect(size / 2 - 1, 0, 2, size);
    };
    flare(true);
    flare(false);
  }
  return c;
}

/**
 * Canvas 程序化星野（贴图渲染 + 离屏暂停，性能优化版）：
 * 星星闪烁 + 随滚动进度"逼近"，支持品牌星辰黄。
 */
export function Starfield({
  density = 0.0005,
  yellowRatio = 0.15,
  progressRef,
  maxZoom = 1.5,
  className = "",
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 预渲染 4 种贴图：白/黄 × 柔光/十字光芒
    const sprites = {
      white: makeStarSprite("rgba(255,255,255,1)", "rgba(214,230,255,0.55)", false),
      whiteFlare: makeStarSprite("rgba(255,255,255,1)", "rgba(190,215,255,0.6)", true),
      yellow: makeStarSprite("rgba(255,240,200,1)", "rgba(255,210,90,0.6)", false),
      yellowFlare: makeStarSprite("rgba(255,246,216,1)", "rgba(255,205,70,0.65)", true),
    };

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
        r: 0.4 + rand() * 1.6,
        base: 0.35 + rand() * 0.65,
        phase: rand() * Math.PI * 2,
        speed: 0.4 + rand() * 1.6,
        yellow: rand() < yellowRatio,
        flare: rand() < 0.08,
      }));
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // 离屏时暂停渲染，避免无效绘制
    let visible = true;
    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    visibilityObserver.observe(canvas);

    let raf = 0;
    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || w === 0) return;

      const progress = progressRef?.current ?? 0;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;

      for (const s of stars) {
        // 随进度外扩（从中心逼近视角）+ 尺寸增大
        const zoom = 1 + progress * maxZoom * s.z;
        const px = cx + (s.x * w - cx) * zoom;
        const py = cy + (s.y * h - cy) * zoom;
        if (px < -40 || px > w + 40 || py < -40 || py > h + 40) continue;

        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.001 * s.speed + s.phase);
        const alpha = Math.min(1, s.base * twinkle * (0.55 + progress * 0.6));
        const radius = s.r * (0.8 + progress * 2.4 * s.z);
        const size = radius * (s.flare ? 12 : 7);

        const sprite = s.yellow
          ? s.flare
            ? sprites.yellowFlare
            : sprites.yellow
          : s.flare
            ? sprites.whiteFlare
            : sprites.white;

        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, px - size / 2, py - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [density, yellowRatio, progressRef, maxZoom]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
