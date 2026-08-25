"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminApi } from "@/lib/api";

type StatItem = { value: string; label: string; labelEn: string };

/** 内容管理 · 数据指标（company-stats） */
export function StatsTab() {
  const [items, setItems] = useState<StatItem[]>([]);

  useEffect(() => {
    adminApi<{ value: Array<Partial<StatItem>> | null }>("/api/settings/company-stats")
      .then(({ value }) => {
        if (Array.isArray(value)) {
          setItems(
            value.map((s) => ({
              value: s.value ?? "",
              label: s.label ?? "",
              labelEn: s.labelEn ?? "",
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const save = () => {
    adminApi("/api/settings/company-stats", {
      method: "PUT",
      body: { value: items.filter((i) => i.value.trim() || i.label.trim()) },
    })
      .then(() => toast.success("保存成功"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "保存失败"));
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">首页数据指标（1-6 条）</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={items.length >= 6}
            onClick={() => setItems((prev) => [...prev, { value: "", label: "", labelEn: "" }])}
          >
            <Plus /> 添加指标
          </Button>
          <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={save}>
            <Save /> 保存
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-[8rem_1fr_1fr_2.5rem] items-center gap-3">
            <Input
              placeholder="数值，如 500+"
              value={item.value}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((s, i) => (i === index ? { ...s, value: e.target.value } : s)),
                )
              }
            />
            <Input
              placeholder="标签（中文），如 交付项目"
              value={item.label}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((s, i) => (i === index ? { ...s, label: e.target.value } : s)),
                )
              }
            />
            <Input
              placeholder="Label (EN), e.g. Projects Delivered"
              value={item.labelEn}
              onChange={(e) =>
                setItems((prev) =>
                  prev.map((s, i) => (i === index ? { ...s, labelEn: e.target.value } : s)),
                )
              }
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label="删除指标"
              disabled={items.length <= 1}
              onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
            >
              <Trash2 className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">暂无指标，点击“添加指标”创建</p>
        )}
      </CardContent>
    </Card>
  );
}
