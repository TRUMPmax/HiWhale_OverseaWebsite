"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
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

/** AI 设置：模型 / 提示词 / 限频 / 降级策略（真实保存，后端约 1 分钟内生效；API Key 只走服务器环境变量 DEEPSEEK_API_KEY） */
export default function AiSettingsPage() {
  const [model, setModel] = useState("deepseek-v3");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [rateLimit, setRateLimit] = useState("20");
  const [dailyLimit, setDailyLimit] = useState("2000");
  const [fallback, setFallback] = useState("human");

  // 加载已保存设置
  useEffect(() => {
    adminApi<{ value: Record<string, string> | null }>("/api/settings/ai-settings")
      .then(({ value }) => {
        if (!value) return;
        if (value.model) setModel(value.model);
        if (value.systemPrompt) setPrompt(value.systemPrompt);
        if (value.ratePerMin) setRateLimit(value.ratePerMin);
        if (value.dailyLimit) setDailyLimit(value.dailyLimit);
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
          systemPrompt: prompt,
          ratePerMin: rateLimit,
          dailyLimit,
          fallback,
        },
      },
    })
      .then(() => toast.success("设置已保存，约 1 分钟内生效"))
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
                  <SelectItem value="deepseek-v3">DeepSeek-V3（deepseek-chat）</SelectItem>
                  <SelectItem value="deepseek-r1">DeepSeek-R1（deepseek-reasoner）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              API Key 在服务器环境变量 DEEPSEEK_API_KEY 配置，不在此处保存。
            </p>
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
              <Label>降级策略（上游故障时）</Label>
              <Select value={fallback} onValueChange={setFallback}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="human">引导转人工（询盘/邮箱）</SelectItem>
                  <SelectItem value="pause">仅提示暂停服务</SelectItem>
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
