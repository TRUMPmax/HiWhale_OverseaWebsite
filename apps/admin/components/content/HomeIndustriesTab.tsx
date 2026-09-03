"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getLocalizedLabel, INDUSTRY_LABELS, Industry } from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/api";

type Row = {
  industry: string;
  solutionSlug: string;
  descZh: string;
  descEn: string;
  painZh: string;
  painEn: string;
};

type SavedCard = {
  industry: string;
  solutionSlug?: string;
  description?: { en: string; zh: string };
  painPoint?: { en: string; zh: string };
};

const emptyRow = (): Row => {
  return { industry: "", solutionSlug: "", descZh: "", descEn: "", painZh: "", painEn: "" };
};

/** 首页行业卡片（site_settings["home-industries"]；portal 首页 HeroNarrative 第二幕 + 行业方案区消费） */
export function HomeIndustriesTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [solutionOptions, setSolutionOptions] = useState<Array<{ slug: string; zh: string }>>([]);

  useEffect(() => {
    adminApi<{ value: SavedCard[] | null }>("/api/settings/home-industries")
      .then((r) => {
        if (Array.isArray(r.value)) {
          setRows(
            r.value.map((c) => ({
              industry: c.industry ?? "",
              solutionSlug: c.solutionSlug ?? "",
              descZh: c.description?.zh ?? "",
              descEn: c.description?.en ?? "",
              painZh: c.painPoint?.zh ?? "",
              painEn: c.painPoint?.en ?? "",
            })),
          );
        }
      })
      .catch(() => {});
    adminApi<{ items: Array<{ slug: string; title: { zh: string } }> }>("/api/solutions")
      .then((r) => setSolutionOptions(r.items.map((s) => ({ slug: s.slug, zh: s.title.zh }))))
      .catch(() => {});
  }, []);

  const patch = (index: number, part: Partial<Row>) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...part } : r)));

  const save = () => {
    const value: SavedCard[] = rows
      .filter((r) => r.industry.trim())
      .map((r) => ({
        industry: r.industry.trim(),
        ...(r.solutionSlug.trim() ? { solutionSlug: r.solutionSlug.trim() } : {}),
        description: { zh: r.descZh, en: r.descEn },
        painPoint: { zh: r.painZh, en: r.painEn },
      }));
    adminApi("/api/settings/home-industries", { method: "PUT", body: { value } })
      .then(() => toast.success("保存成功"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "保存失败"));
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">首页行业卡片</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRows((prev) => [...prev, emptyRow()])}
        >
          <Plus /> 添加卡片
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-slate-500">
          配置门户首页「行业解决方案」卡片区与 Hero 第二幕场景卡片，顺序即展示顺序（Hero 最多取前 6
          张）。行业可下拉选择或手输自定义文本；行业场景图仍在「素材管理 → 站点素材位 → 行业」按
          industry-行业.png 上传。无任何卡片时前台回退内置 6
          个核心行业；核心行业文案留空时回退内置双语文案。
        </p>
        {rows.map((row, index) => (
          <div key={index} className="space-y-2 rounded-lg border border-slate-100 p-3">
            <div className="flex items-center gap-2">
              <Input
                list="home-industry-options"
                placeholder="行业（可选可输，如 E_COMMERCE 或 新能源）"
                className="w-64"
                value={row.industry}
                onChange={(e) => patch(index, { industry: e.target.value })}
              />
              <datalist id="home-industry-options">
                {Object.values(Industry).map((ind) => (
                  <option key={ind} value={ind}>
                    {getLocalizedLabel(INDUSTRY_LABELS, ind, "zh")}
                  </option>
                ))}
              </datalist>
              <Input
                list="home-solution-options"
                placeholder="跳转方案 slug（可空）"
                value={row.solutionSlug}
                onChange={(e) => patch(index, { solutionSlug: e.target.value })}
              />
              <datalist id="home-solution-options">
                {solutionOptions.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.zh}
                  </option>
                ))}
              </datalist>
              <Button
                variant="ghost"
                size="icon"
                aria-label="删除卡片"
                className="ml-auto"
                onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="卡片描述（中文）"
                value={row.descZh}
                onChange={(e) => patch(index, { descZh: e.target.value })}
              />
              <Input
                placeholder="Description (EN)"
                value={row.descEn}
                onChange={(e) => patch(index, { descEn: e.target.value })}
              />
              <Input
                placeholder="痛点标签（中文），如：大促爆单"
                value={row.painZh}
                onChange={(e) => patch(index, { painZh: e.target.value })}
              />
              <Input
                placeholder="Pain point (EN)"
                value={row.painEn}
                onChange={(e) => patch(index, { painEn: e.target.value })}
              />
            </div>
          </div>
        ))}
        <div>
          <Label className="sr-only">保存</Label>
          <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={save}>
            <Save /> 保存
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
