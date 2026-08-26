"use client";

import { useEffect, useRef, useState } from "react";
import { Placeholder } from "./Placeholder";

type SlottedImageProps = {
  /** 图片路径（/images/...），加载失败时回退占位块 */
  src: string;
  /** 可选二级回退图：src 加载失败时改试该路径，再失败才回退占位块 */
  fallbackSrc?: string;
  alt: string;
  className: string;
  placeholder: {
    label: string;
    size?: string;
    name: string;
    ratio?: string;
    className?: string;
    variant?: "light" | "dark" | "block";
    compact?: boolean;
  };
};

/** 素材位图片：文件存在即显示真图，加载失败（未投放）自动回退占位块 */
export function SlottedImage({ src, fallbackSrc, alt, className, placeholder }: SlottedImageProps) {
  // 0 = 主图，1 = 回退图，2 = 占位块
  const [stage, setStage] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const activeSrc = stage === 1 && fallbackSrc ? fallbackSrc : src;

  const handleError = () => setStage((s) => (s === 0 && fallbackSrc ? 1 : 2));

  // hydration 前 404 的图片不会触发 React onError，挂载后补检一次（主图/回退图两个阶段都补检）
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setStage((s) => (s === 0 && fallbackSrc ? 1 : 2));
    }
  }, [stage, fallbackSrc]);

  if (stage === 2) {
    return (
      <Placeholder
        ratio={placeholder.ratio}
        className={placeholder.className}
        variant={placeholder.variant}
        compact={placeholder.compact}
        label={placeholder.label}
        size={placeholder.size}
        name={placeholder.name}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={activeSrc}
      ref={imgRef}
      src={activeSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
