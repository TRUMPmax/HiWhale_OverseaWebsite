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
  /** 配色变体：light 虚线（白/浅灰区块）、dark 虚线（深蓝区块）、block 实色块（无素材时的色块占位） */
  variant?: "light" | "dark" | "block";
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
  const containerClass =
    variant === "dark"
      ? "border-white/30 bg-white/5"
      : variant === "block"
        ? "border-brand-blue/40 bg-brand-blue/10 border-solid"
        : "border-border bg-brand-light";
  const iconClass =
    variant === "dark"
      ? "text-white/60"
      : variant === "block"
        ? "text-brand-blue/60"
        : "text-subtle";
  const labelClass = variant === "dark" ? "text-white" : "text-foreground";
  const subClass = variant === "dark" ? "text-white/60" : "text-muted";
  const descClass = variant === "dark" ? "text-white/50" : "text-subtle";
  const nameClass =
    variant === "dark"
      ? "bg-white/10 text-white/80"
      : variant === "block"
        ? "bg-brand-blue/20 text-brand-blue"
        : "border-border text-muted border bg-white";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center ${containerClass} ${ratio ?? ""} ${className}`}
    >
      <ImageIcon className={`h-10 w-10 ${iconClass}`} />
      <span className={`mt-3 font-medium ${labelClass}`}>{label}</span>
      {format && <span className={`mt-1 text-sm ${subClass}`}>{format}</span>}
      {size && <span className={`text-sm ${subClass}`}>{size}</span>}
      {description && <p className={`mt-2 max-w-xs text-sm ${descClass}`}>{description}</p>}
      {name && (
        <span className={`mt-3 rounded-md px-2 py-1 font-mono text-xs ${nameClass}`}>
          素材名：{name}
        </span>
      )}
    </div>
  );
}
