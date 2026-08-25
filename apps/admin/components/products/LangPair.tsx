"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type LangPairProps = {
  label: string;
  zhValue: string;
  enValue: string;
  onZhChange: (v: string) => void;
  onEnChange: (v: string) => void;
  zhPlaceholder?: string;
  enPlaceholder?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  error?: string;
};

/** 中英双语输入对（并排 2 列） */
export function LangPair({
  label,
  zhValue,
  enValue,
  onZhChange,
  onEnChange,
  zhPlaceholder,
  enPlaceholder,
  textarea = false,
  rows = 2,
  required = false,
  error,
}: LangPairProps) {
  const Field = textarea ? Textarea : Input;
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required ? " *" : ""}
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <Field
          rows={textarea ? rows : undefined}
          placeholder={zhPlaceholder ?? "中文"}
          value={zhValue}
          onChange={(e) => onZhChange(e.target.value)}
        />
        <Field
          rows={textarea ? rows : undefined}
          placeholder={enPlaceholder ?? "English"}
          value={enValue}
          onChange={(e) => onEnChange(e.target.value)}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
