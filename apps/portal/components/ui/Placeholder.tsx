import { Image as ImageIcon } from "lucide-react";

type PlaceholderProps = {
  /** 图片需求描述（该位置需要什么图） */
  label: string;
  /** 文件格式说明，如 "JPG / WebP" */
  format?: string;
  /** 尺寸比例与建议分辨率，如 "16:9 · 建议 1920×1080" */
  size?: string;
  /** 补充说明 */
  description?: string;
  /** 素材文件名（另起一行展示，方便后期按名替换） */
  name?: string;
  /** Tailwind 宽高比类，如 "aspect-video"、"aspect-[4/3]"、"aspect-square" */
  ratio?: string;
  /** 配色变体：light 用于白/浅灰区块，dark 用于深蓝区块 */
  variant?: "light" | "dark";
  className?: string;
};

/** 通用素材占位组件：图片需求 + 尺寸比例 + 素材文件名 */
export function Placeholder({
  label,
  format,
  size,
  description,
  name,
  ratio,
  variant = "light",
  className = "",
}: PlaceholderProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center ${
        isDark ? "border-white/30 bg-white/5" : "border-border bg-brand-light"
      } ${ratio ?? ""} ${className}`}
    >
      <ImageIcon className={`h-10 w-10 ${isDark ? "text-white/60" : "text-subtle"}`} />
      <span className={`mt-3 font-medium ${isDark ? "text-white" : "text-foreground"}`}>
        {label}
      </span>
      {format && (
        <span className={`mt-1 text-sm ${isDark ? "text-white/60" : "text-muted"}`}>{format}</span>
      )}
      {size && <span className={`text-sm ${isDark ? "text-white/60" : "text-muted"}`}>{size}</span>}
      {description && (
        <p className={`mt-2 max-w-xs text-sm ${isDark ? "text-white/50" : "text-subtle"}`}>
          {description}
        </p>
      )}
      {name && (
        <span
          className={`mt-3 rounded-md px-2 py-1 font-mono text-xs ${
            isDark ? "bg-white/10 text-white/80" : "border-border text-muted border bg-white"
          }`}
        >
          素材名：{name}
        </span>
      )}
    </div>
  );
}
