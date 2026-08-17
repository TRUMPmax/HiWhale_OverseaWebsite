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
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-brand-light p-8 text-center">
      <ImageIcon className="h-10 w-10 text-subtle" />
      <span className="mt-3 font-medium text-foreground">{label}</span>
      {format && <span className="mt-1 text-sm text-muted">{format}</span>}
      {size && <span className="text-sm text-muted">{size}</span>}
      {description && <p className="mt-2 max-w-xs text-sm text-subtle">{description}</p>}
    </div>
  );
}
