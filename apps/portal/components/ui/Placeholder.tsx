import { Image as ImageIcon } from "lucide-react";

type PlaceholderProps = {
  label: string;
  format?: string;
  size?: string;
  description?: string;
};

/** 通用素材占位组件 */
export function Placeholder({ label, format, size, description }: PlaceholderProps) {
  return (
    <div className="border-border bg-brand-light flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center">
      <ImageIcon className="text-subtle h-10 w-10" />
      <span className="text-foreground mt-3 font-medium">{label}</span>
      {format && <span className="text-muted mt-1 text-sm">{format}</span>}
      {size && <span className="text-muted text-sm">{size}</span>}
      {description && <p className="text-subtle mt-2 max-w-xs text-sm">{description}</p>}
    </div>
  );
}
