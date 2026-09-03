"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsTab } from "@/components/content/StatsTab";
import { HomeIndustriesTab } from "@/components/content/HomeIndustriesTab";
import { AboutTab } from "@/components/content/AboutTab";
import { ContactInfoTab } from "@/components/content/ContactInfoTab";
import { adminApi } from "@/lib/api";

type FooterLink = { label: string; url: string };

const INITIAL_FOOTER_LINKS: FooterLink[] = [{ label: "隐私政策", url: "/privacy-policy" }];

/** 内容管理：Footer 链接 / 数据指标 / 首页行业 / 公司介绍 / 联系方式 / 隐私政策（均对接 portal 真实消费；Banner 与多语言文案已下线——portal 文案走 next-intl 双文件体系） */
export default function ContentPage() {
  const [links, setLinks] = useState<FooterLink[]>(INITIAL_FOOTER_LINKS);
  const [privacyZh, setPrivacyZh] = useState("");
  const [privacyEn, setPrivacyEn] = useState("");

  // 加载已保存内容
  useEffect(() => {
    const load = (key: string) =>
      adminApi<{ value: unknown }>(`/api/settings/${key}`).then((r) => r.value);
    load("content-footer-links")
      .then((v) => v && setLinks(v as FooterLink[]))
      .catch(() => {});
    // 隐私政策：双语对象；兼容历史纯字符串值（视为中文）
    load("content-privacy")
      .then((v) => {
        if (typeof v === "string") setPrivacyZh(v);
        else if (v && typeof v === "object") {
          const obj = v as { zh?: string; en?: string };
          setPrivacyZh(obj.zh ?? "");
          setPrivacyEn(obj.en ?? "");
        }
      })
      .catch(() => {});
  }, []);

  const saveKey = (key: string, value: unknown) => {
    adminApi(`/api/settings/${key}`, { method: "PUT", body: { value } })
      .then(() => toast.success("保存成功"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "保存失败"));
  };

  const savePrivacy = () => {
    const value = {
      ...(privacyZh.trim() ? { zh: privacyZh } : {}),
      ...(privacyEn.trim() ? { en: privacyEn } : {}),
    };
    saveKey("content-privacy", value);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="内容管理" description="页脚链接、公司数据与页面内容管理" />

      <Tabs defaultValue="footer">
        <TabsList>
          <TabsTrigger value="footer">Footer 链接</TabsTrigger>
          <TabsTrigger value="stats">数据指标</TabsTrigger>
          <TabsTrigger value="homeIndustries">首页行业</TabsTrigger>
          <TabsTrigger value="about">公司介绍</TabsTrigger>
          <TabsTrigger value="contact">联系方式</TabsTrigger>
          <TabsTrigger value="privacy">隐私政策</TabsTrigger>
        </TabsList>

        {/* Footer 链接（portal 页脚底部法律链接栏真实消费 content-footer-links） */}
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
                onClick={() => saveKey("content-footer-links", links)}
              >
                <Save /> 保存
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 数据指标 */}
        <TabsContent value="stats" className="mt-4">
          <StatsTab />
        </TabsContent>

        <TabsContent value="homeIndustries" className="mt-4">
          <HomeIndustriesTab />
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <AboutTab />
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <ContactInfoTab />
        </TabsContent>

        <TabsContent value="privacy" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">中文内容</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  rows={14}
                  value={privacyZh}
                  placeholder="留空则中文页展示内置政策文案"
                  onChange={(e) => setPrivacyZh(e.target.value)}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">English Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  rows={14}
                  value={privacyEn}
                  placeholder="Leave empty to show the built-in English policy"
                  onChange={(e) => setPrivacyEn(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={savePrivacy}>
              <Save /> 保存
            </Button>
            <p className="text-xs text-slate-500">
              隐私政策按语言分别展示：中文页取中文内容，英文页取英文内容；留空的一侧展示内置双语政策。
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
