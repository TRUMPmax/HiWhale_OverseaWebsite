"use client";

import { useEffect, useRef, useState } from "react";
import { Placeholder } from "./Placeholder";

type SlottedImageProps = {
  /** 图片路径（/images/...），加载失败时回退占位块 */
  src: string;
  alt: string;
  className: string;
  placeholder: {
    label: string;
    size: string;
    name: string;
    ratio: string;
    className?: string;
  };
};

/** 素材位图片：文件存在即显示真图，加载失败（未投放）自动回退占位块 */
export function SlottedImage({ src, alt, className, placeholder }: SlottedImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // hydration 前 404 的图片不会触发 React onError，挂载后补检一次
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <Placeholder
        ratio={placeholder.ratio}
        className={placeholder.className}
        label={placeholder.label}
        size={placeholder.size}
        name={placeholder.name}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={imgRef} src={src} alt={alt} className={className} onError={() => setFailed(true)} />
  );
}
