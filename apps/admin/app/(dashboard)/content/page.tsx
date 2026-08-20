"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/PageHeader";

type Banner = { id: string; titleEn: string; titleZh: string; imageName: string };
type CopyEntry = { key: string; en: string; zh: string };
type FooterLink = { label: string; url: string };

const INITIAL_BANNERS: Banner[] = [
  {
    id: "b-1",
    titleEn: "From Equipment to System, One Integrated Solution",
    titleZh: "从设备到系统，一体化交付",
    imageName: "banner-hero-main.png",
  },
  {
    id: "b-2",
    titleEn: "Automate Your Peak Season",
    titleZh: "大促季自动化专题",
    imageName: "banner-peak-season.png",
  },
  {
    id: "b-3",
    titleEn: "Cold Chain Automation Series",
    titleZh: "冷链自动化专题",
    imageName: "banner-cold-chain.png",
  },
];

const INITIAL_COPY: CopyEntry[] = [
  {
    key: "home.hero.title",
    en: "From Equipment to System, One Integrated Solution",
    zh: "从设备到系统，一体化交付",
  },
  {
    key: "home.hero.subtitle",
    en: "HiWhale Robotics delivers end-to-end intelligent warehousing and material handling.",
    zh: "浩鲸机器人提供端到端智能仓储与货物转运解决方案。",
  },
  {
    key: "home.hero.ctaPrimary",
    en: "Explore Products",
    zh: "浏览产品",
  },
];

const INITIAL_FOOTER_LINKS: FooterLink[] = [
  { label: "隐私政策", url: "/privacy-policy" },
  { label: "服务条款", url: "/terms" },
  { label: "网站地图", url: "/sitemap" },
];

/** 内容管理：Banner / 多语言文案 / Footer 链接 / 隐私政策 */
export default function ContentPage() {
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [copy, setCopy] = useState<CopyEntry[]>(INITIAL_COPY);
  const [links, setLinks] = useState<FooterLink[]>(INITIAL_FOOTER_LINKS);
  const [privacy, setPrivacy] = useState(
    "本政策说明浩鲸机器人如何收集、使用与保护您的个人信息……（占位文本）",
  );

  const moveBanner = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= banners.length) return;
    setBanners((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="内容管理" description="站点文案、Banner 与页面内容管理" />

      <Tabs defaultValue="banners">
        <TabsList>
          <TabsTrigger value="banners">首页 Banner</TabsTrigger>
          <TabsTrigger value="copy">多语言文案</TabsTrigger>
          <TabsTrigger value="footer">Footer 链接</TabsTrigger>
          <TabsTrigger value="privacy">隐私政策</TabsTrigger>
        </TabsList>

        {/* Banner */}
        <TabsContent value="banners" className="mt-4 space-y-4">
          {banners.map((banner, index) => (
            <Card key={banner.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-16 w-28 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-center">
                  <Upload className="h-4 w-4 text-slate-400" />
                  <span className="mt-1 font-mono text-[0.625rem] text-slate-400">
                    {banner.imageName}
                  </span>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-3">
                  <Input
                    value={banner.titleEn}
                    placeholder="标题（英文）"
                    onChange={(e) =>
                      setBanners((prev) =>
                        prev.map((b, i) => (i === index ? { ...b, titleEn: e.target.value } : b)),
                      )
                    }
                  />
                  <Input
                    value={banner.titleZh}
                    placeholder="标题（中文）"
                    onChange={(e) =>
                      setBanners((prev) =>
                        prev.map((b, i) => (i === index ? { ...b, titleZh: e.target.value } : b)),
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="上移"
                    disabled={index === 0}
                    onClick={() => moveBanner(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="下移"
                    disabled={index === banners.length - 1}
                    onClick={() => moveBanner(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            className="bg-brand-blue hover:bg-brand-blue/90"
            onClick={() => toast.success("保存成功")}
          >
            <Save /> 保存
          </Button>
        </TabsContent>

        {/* 多语言文案 */}
        <TabsContent value="copy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">多语言文案（首页 Hero）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {copy.map((entry, index) => (
                <div key={entry.key} className="grid grid-cols-[10rem_1fr_1fr] items-start gap-3">
                  <span className="pt-2 font-mono text-xs text-slate-500">{entry.key}</span>
                  <Textarea
                    rows={2}
                    value={entry.en}
                    onChange={(e) =>
                      setCopy((prev) =>
                        prev.map((c, i) => (i === index ? { ...c, en: e.target.value } : c)),
                      )
                    }
                  />
                  <Textarea
                    rows={2}
                    value={entry.zh}
                    onChange={(e) =>
                      setCopy((prev) =>
                        prev.map((c, i) => (i === index ? { ...c, zh: e.target.value } : c)),
                      )
                    }
                  />
                </div>
              ))}
              <Button
                className="bg-brand-blue hover:bg-brand-blue/90"
                onClick={() => toast.success("保存成功")}
              >
                <Save /> 保存
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer 链接 */}
        <TabsContent value="footer" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Footer 链接</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLinks((prev) => [...prev, { label: "", url: "" }])}
              >
                <Plus /> 添加链接
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    placeholder="链接名称"
                    value={link.label}
                    onChange={(e) =>
                      setLinks((prev) =>
                        prev.map((l, i) => (i === index ? { ...l, label: e.target.value } : l)),
                      )
                    }
                  />
                  <Input
                    placeholder="URL，如 /privacy-policy"
                    value={link.url}
                    onChange={(e) =>
                      setLinks((prev) =>
                        prev.map((l, i) => (i === index ? { ...l, url: e.target.value } : l)),
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="删除链接"
                    onClick={() => setLinks((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              ))}
              <Button
                className="bg-brand-blue hover:bg-brand-blue/90"
                onClick={() => toast.success("保存成功")}
              >
                <Save /> 保存
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 隐私政策 */}
        <TabsContent value="privacy" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">编辑</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label>富文本编辑器占位（后续接入 TipTap）</Label>
                <Textarea rows={12} value={privacy} onChange={(e) => setPrivacy(e.target.value)} />
                <Button
                  className="bg-brand-blue hover:bg-brand-blue/90"
                  onClick={() => toast.success("保存成功")}
                >
                  <Save /> 保存
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">预览</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {privacy}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
