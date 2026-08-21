"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/common/PageHeader";
import { adminApi } from "@/lib/api";

const DEFAULT_PROMPT =
  "你是浩鲸机器人（HiWhale Robotics）门户的 AI 销售助手。请用简洁专业的语言回答客户关于智能仓储、AGV/AMR 产品、行业方案的问题。涉及价格时引导客户提交询盘。不要编造未提供的参数。";

/** AI 设置：模型 / 密钥 / 提示词 / 限频 / 降级策略（Mock 保存） */
export default function AiSettingsPage() {
  const [model, setModel] = useState("deepseek-v3");
  const [apiKey, setApiKey] = useState("sk-mock-8f3a1c72e94b4d5a9c01");
  const [showKey, setShowKey] = useState(false);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [rateLimit, setRateLimit] = useState("20");
  const [dailyLimit, setDailyLimit] = useState("2000");
  const [budget, setBudget] = useState("500");
  const [fallback, setFallback] = useState("human");

  // 加载已保存设置
  useEffect(() => {
    adminApi<{ value: Record<string, string> | null }>("/api/settings/ai-settings")
      .then(({ value }) => {
        if (!value) return;
        if (value.model) setModel(value.model);
        if (value.apiKey) setApiKey(value.apiKey);
        if (value.systemPrompt) setPrompt(value.systemPrompt);
        if (value.ratePerMin) setRateLimit(value.ratePerMin);
        if (value.dailyLimit) setDailyLimit(value.dailyLimit);
        if (value.monthlyBudget) setBudget(value.monthlyBudget);
        if (value.fallback) setFallback(value.fallback);
      })
      .catch(() => {});
  }, []);

  const save = () => {
    adminApi("/api/settings/ai-settings", {
      method: "PUT",
      body: {
        value: {
          model,
          apiKey,
          systemPrompt: prompt,
          ratePerMin: rateLimit,
          dailyLimit,
          monthlyBudget: budget,
          fallback,
        },
      },
    })
      .then(() => toast.success("设置已保存"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "保存失败"));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI 设置" description="模型选择、提示词与限频策略" />

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">模型与密钥</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>模型选择</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deepseek-v3">DeepSeek-V3</SelectItem>
                  <SelectItem value="deepseek-r1">DeepSeek-R1</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>API Key</Label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showKey ? "隐藏" : "显示"}
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">限频与预算</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>每分钟请求数</Label>
                <Input
                  type="number"
                  min={1}
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>每日上限（次）</Label>
                <Input
                  type="number"
                  min={1}
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>月度预算（USD）</Label>
              <Input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>降级策略（超限/故障时）</Label>
              <Select value={fallback} onValueChange={setFallback}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">转人工</SelectItem>
                  <SelectItem value="faq">仅 FAQ</SelectItem>
                  <SelectItem value="pause">暂停服务</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </CardContent>
      </Card>

      <div>
        <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={save}>
          <Save /> 保存设置
        </Button>
      </div>
    </div>
  );
}
