"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type SpecItemDraft = {
  labelZh: string;
  labelEn: string;
  valueZh: string;
  valueEn: string;
};
export type SpecGroupDraft = { groupZh: string; groupEn: string; items: SpecItemDraft[] };

type SpecGroupsEditorProps = {
  groups: SpecGroupDraft[];
  onChange: (groups: SpecGroupDraft[]) => void;
};

/** 详细参数表编辑器：分组（中英组名）+ 组内参数行（中英标签 + 值） */
export function SpecGroupsEditor({ groups, onChange }: SpecGroupsEditorProps) {
  const update = (gi: number, patch: Partial<SpecGroupDraft>) =>
    onChange(groups.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  const updateItem = (gi: number, ii: number, patch: Partial<SpecItemDraft>) =>
    onChange(
      groups.map((g, i) =>
        i === gi
          ? { ...g, items: g.items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) }
          : g,
      ),
    );

  return (
    <div className="space-y-6">
      {groups.map((group, gi) => (
        <div key={gi} className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <Input
              placeholder="组名（中文），如：性能参数"
              value={group.groupZh}
              onChange={(e) => update(gi, { groupZh: e.target.value })}
            />
            <Input
              placeholder="Group name (EN), e.g. Performance"
              value={group.groupEn}
              onChange={(e) => update(gi, { groupEn: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="删除分组"
              onClick={() => onChange(groups.filter((_, i) => i !== gi))}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            {group.items.map((item, ii) => (
              <div key={ii} className="flex items-start gap-2">
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <Input
                    placeholder="参数名（中文）"
                    value={item.labelZh}
                    onChange={(e) => updateItem(gi, ii, { labelZh: e.target.value })}
                  />
                  <Input
                    placeholder="Label (EN)"
                    value={item.labelEn}
                    onChange={(e) => updateItem(gi, ii, { labelEn: e.target.value })}
                  />
                  <Input
                    placeholder="参数值（中文）"
                    value={item.valueZh}
                    onChange={(e) => updateItem(gi, ii, { valueZh: e.target.value })}
                  />
                  <Input
                    placeholder="Value (EN)"
                    value={item.valueEn}
                    onChange={(e) => updateItem(gi, ii, { valueEn: e.target.value })}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="删除参数"
                  onClick={() => update(gi, { items: group.items.filter((_, j) => j !== ii) })}
                >
                  <Trash2 className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() =>
              update(gi, {
                items: [...group.items, { labelZh: "", labelEn: "", valueZh: "", valueEn: "" }],
              })
            }
          >
            <Plus /> 添加参数
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...groups,
            {
              groupZh: "",
              groupEn: "",
              items: [{ labelZh: "", labelEn: "", valueZh: "", valueEn: "" }],
            },
          ])
        }
      >
        <Plus /> 添加参数分组
      </Button>
    </div>
  );
}
