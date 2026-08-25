"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/lib/api";

type AboutValue = {
  mission: string;
  missionEn: string;
  positioning: {
    title: string;
    titleEn: string;
    text: string;
    textEn: string;
    text2: string;
    text2En: string;
  };
  milestones: Array<{ year: string; event: string; eventEn: string }>;
  rd: { text: string; textEn: string; engineers: string; patents: string; countries: string };
  locations: Array<{ city: string; cityEn: string }>;
  certifications: string[];
};

const EMPTY: AboutValue = {
  mission: "",
  missionEn: "",
  positioning: { title: "", titleEn: "", text: "", textEn: "", text2: "", text2En: "" },
  milestones: [],
  rd: { text: "", textEn: "", engineers: "", patents: "", countries: "" },
  locations: [],
  certifications: [],
};

/** 内容管理 · 公司介绍（company-about） */
export function AboutTab() {
  const [form, setForm] = useState<AboutValue>(EMPTY);

  useEffect(() => {
    adminApi<{ value: Partial<AboutValue> | null }>("/api/settings/company-about")
      .then(({ value }) => {
        if (!value) return;
        setForm({
          mission: value.mission ?? "",
          missionEn: value.missionEn ?? "",
          positioning: { ...EMPTY.positioning, ...value.positioning },
          milestones: (value.milestones ?? []).map((m) => ({
            year: m.year ?? "",
            event: m.event ?? "",
            eventEn: m.eventEn ?? "",
          })),
          rd: { ...EMPTY.rd, ...value.rd },
          locations: (value.locations ?? []).map((l) => ({
            city: l.city ?? "",
            cityEn: l.cityEn ?? "",
          })),
          certifications: value.certifications ?? [],
        });
      })
      .catch(() => {});
  }, []);

  const save = () => {
    adminApi("/api/settings/company-about", { method: "PUT", body: { value: form } })
      .then(() => toast.success("保存成功"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "保存失败"));
  };

  const setPos = (key: keyof AboutValue["positioning"], v: string) =>
    setForm((f) => ({ ...f, positioning: { ...f.positioning, [key]: v } }));
  const setRd = (key: keyof AboutValue["rd"], v: string) =>
    setForm((f) => ({ ...f, rd: { ...f.rd, [key]: v } }));

  return (
    <div className="space-y-4">
      {/* 使命 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">使命宣言</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>中文</Label>
            <Textarea
              rows={3}
              value={form.mission}
              onChange={(e) => setForm({ ...form, mission: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>English</Label>
            <Textarea
              rows={3}
              value={form.missionEn}
              onChange={(e) => setForm({ ...form, missionEn: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* 定位 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">公司定位</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>标题（中文）</Label>
              <Input
                value={form.positioning.title}
                onChange={(e) => setPos("title", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Title (EN)</Label>
              <Input
                value={form.positioning.titleEn}
                onChange={(e) => setPos("titleEn", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>正文一（中文）</Label>
              <Textarea
                rows={3}
                value={form.positioning.text}
                onChange={(e) => setPos("text", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Text 1 (EN)</Label>
              <Textarea
                rows={3}
                value={form.positioning.textEn}
                onChange={(e) => setPos("textEn", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>正文二（中文）</Label>
              <Textarea
                rows={3}
                value={form.positioning.text2}
                onChange={(e) => setPos("text2", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Text 2 (EN)</Label>
              <Textarea
                rows={3}
                value={form.positioning.text2En}
                onChange={(e) => setPos("text2En", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 里程碑 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">发展历程</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((f) => ({
                ...f,
                milestones: [...f.milestones, { year: "", event: "", eventEn: "" }],
              }))
            }
          >
            <Plus /> 添加节点
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.milestones.map((m, index) => (
            <div key={index} className="grid grid-cols-[6rem_1fr_1fr_2.5rem] items-center gap-3">
              <Input
                placeholder="年份"
                value={m.year}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    milestones: f.milestones.map((x, i) =>
                      i === index ? { ...x, year: e.target.value } : x,
                    ),
                  }))
                }
              />
              <Input
                placeholder="事件（中文）"
                value={m.event}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    milestones: f.milestones.map((x, i) =>
                      i === index ? { ...x, event: e.target.value } : x,
                    ),
                  }))
                }
              />
              <Input
                placeholder="Event (EN)"
                value={m.eventEn}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    milestones: f.milestones.map((x, i) =>
                      i === index ? { ...x, eventEn: e.target.value } : x,
                    ),
                  }))
                }
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="删除节点"
                onClick={() =>
                  setForm((f) => ({ ...f, milestones: f.milestones.filter((_, i) => i !== index) }))
                }
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 研发实力 + 全球布局 + 认证 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">研发实力</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>介绍（中文）</Label>
              <Textarea
                rows={3}
                value={form.rd.text}
                onChange={(e) => setRd("text", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Intro (EN)</Label>
              <Textarea
                rows={3}
                value={form.rd.textEn}
                onChange={(e) => setRd("textEn", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>研发工程师</Label>
              <Input
                value={form.rd.engineers}
                onChange={(e) => setRd("engineers", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>专利</Label>
              <Input value={form.rd.patents} onChange={(e) => setRd("patents", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>服务国家</Label>
              <Input
                value={form.rd.countries}
                onChange={(e) => setRd("countries", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">全球布局</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setForm((f) => ({ ...f, locations: [...f.locations, { city: "", cityEn: "" }] }))
            }
          >
            <Plus /> 添加地点
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.locations.map((l, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_2.5rem] items-center gap-3">
              <Input
                placeholder="城市（中文）"
                value={l.city}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    locations: f.locations.map((x, i) =>
                      i === index ? { ...x, city: e.target.value } : x,
                    ),
                  }))
                }
              />
              <Input
                placeholder="City (EN)"
                value={l.cityEn}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    locations: f.locations.map((x, i) =>
                      i === index ? { ...x, cityEn: e.target.value } : x,
                    ),
                  }))
                }
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="删除地点"
                onClick={() =>
                  setForm((f) => ({ ...f, locations: f.locations.filter((_, i) => i !== index) }))
                }
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">资质认证</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setForm((f) => ({ ...f, certifications: [...f.certifications, ""] }))}
          >
            <Plus /> 添加认证
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.certifications.map((cert, index) => (
            <div key={index} className="grid grid-cols-[1fr_2.5rem] items-center gap-3">
              <Input
                placeholder="认证名称，如 ISO 9001"
                value={cert}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    certifications: f.certifications.map((x, i) =>
                      i === index ? e.target.value : x,
                    ),
                  }))
                }
              />
              <Button
                variant="ghost"
                size="icon"
                aria-label="删除认证"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    certifications: f.certifications.filter((_, i) => i !== index),
                  }))
                }
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={save}>
          <Save /> 保存公司介绍
        </Button>
      </div>
    </div>
  );
}
