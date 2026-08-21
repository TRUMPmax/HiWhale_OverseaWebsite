type BrandNameProps = {
  /** dark：深色夜幕背景（Hi 星辰黄 + Whale Robotics 亮蓝）；light：白/浅背景（Hi 琥珀金 + 品牌深蓝） */
  variant?: "dark" | "light";
  className?: string;
};

/** 品牌名：Hi（亮黄品牌特征）+ Whale Robotics（蓝） */
export function BrandName({ variant = "dark", className = "" }: BrandNameProps) {
  const hiClass = variant === "dark" ? "text-brand-star" : "text-amber-500";
  const restClass = variant === "dark" ? "text-blue-400" : "text-brand-navy";

  return (
    <span className={className}>
      <span className={hiClass}>Hi</span>
      <span className={restClass}>Whale Robotics</span>
    </span>
  );
}
