"use client";

import { useState } from "react";
import { Save, Send, Upload } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";

const PAGE_SIZE = 8;

/** 操作日志 Mock（20 条） */
const OP_LOGS = Array.from({ length: 20 }, (_, i) => {
  const actions = [
    { action: "更新产品", target: "MBV15R 平衡重式无人叉车" },
    { action: "分配询盘", target: "INQ-0820-01 → 陈凯文" },
    { action: "登录后台", target: "-" },
    { action: "上传文档", target: "MBV15R-产品规格书.pdf" },
    { action: "更新 AI 设置", target: "System Prompt" },
    { action: "禁用用户", target: "Emma Dubois" },
  ];
  const action = actions[i % actions.length];
  const date = new Date(Date.now() - i * 3600000 * 5);
  return {
    id: `log-${i + 1}`,
    time: date.toLocaleString("zh-CN", { hour12: false }),
    operator: ["系统管理员", "陈凯文", "李晓梅"][i % 3],
    action: action.action,
    target: action.target,
  };
});

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
      <span className="text-sm text-slate-700">{label}</span>
      <input
        type="checkbox"
        className="accent-brand-blue h-4 w-4"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

/** 系统设置：基本信息 / SMTP / 通知 / 操作日志 */
export default function SettingsPage() {
  const [siteName, setSiteName] = useState("HiWhale Robotics");
  const [defaultLocale, setDefaultLocale] = useState("en");
  const [smtp, setSmtp] = useState({
    host: "smtp.exmail.qq.com",
    port: "465",
    account: "noreply@hiwhale.com",
    password: "",
    sender: "HiWhale 通知",
  });
  const [notifications, setNotifications] = useState({
    newInquiry: true,
    aiHandoff: true,
    dailyDigest: false,
  });
  const [logPage, setLogPage] = useState(1);

  const logItems = OP_LOGS.slice((logPage - 1) * PAGE_SIZE, logPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader title="系统设置" description="系统参数与集成配置" />

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">基本信息</TabsTrigger>
          <TabsTrigger value="smtp">SMTP 配置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="logs">操作日志</TabsTrigger>
        </TabsList>

        {/* 基本信息 */}
        <TabsContent value="basic" className="mt-4">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle className="text-base">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>站点名称</Label>
                <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>站点 Logo</Label>
                <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 text-center">
                  <Upload className="h-5 w-5 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    点击或拖拽上传 Logo（占位，后端就绪后接 MinIO）
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>默认语言</Label>
                <Select value={defaultLocale} onValueChange={setDefaultLocale}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="bg-brand-blue hover:bg-brand-blue/90"
                onClick={() => toast.success("保存成功")}
              >
                <Save /> 保存
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP */}
        <TabsContent value="smtp" className="mt-4">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle className="text-base">SMTP 配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>SMTP 主机</Label>
                  <Input
                    value={smtp.host}
                    onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>端口</Label>
                  <Input
                    value={smtp.port}
                    onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>账号</Label>
                <Input
                  value={smtp.account}
                  onChange={(e) => setSmtp({ ...smtp, account: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>密码</Label>
                <Input
                  type="password"
                  value={smtp.password}
                  onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>发件人名称</Label>
                <Input
                  value={smtp.sender}
                  onChange={(e) => setSmtp({ ...smtp, sender: e.target.value })}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-brand-blue hover:bg-brand-blue/90"
                  onClick={() => toast.success("保存成功")}
                >
                  <Save /> 保存
                </Button>
                <Button variant="outline" onClick={() => toast.success("测试邮件已发送，请查收")}>
                  <Send /> 发送测试邮件
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle className="text-base">通知设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Toggle
                checked={notifications.newInquiry}
                onChange={(v) => setNotifications({ ...notifications, newInquiry: v })}
                label="新询盘邮件通知"
              />
              <Toggle
                checked={notifications.aiHandoff}
                onChange={(v) => setNotifications({ ...notifications, aiHandoff: v })}
                label="AI 转人工通知"
              />
              <Toggle
                checked={notifications.dailyDigest}
                onChange={(v) => setNotifications({ ...notifications, dailyDigest: v })}
                label="每日汇总邮件"
              />
              <Button
                className="bg-brand-blue hover:bg-brand-blue/90 mt-2"
                onClick={() => toast.success("保存成功")}
              >
                <Save /> 保存
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 操作日志 */}
        <TabsContent value="logs" className="mt-4">
          <div className="rounded-xl border border-slate-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>动作</TableHead>
                  <TableHead>对象</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logItems.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-slate-500">{log.time}</TableCell>
                    <TableCell>{log.operator}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="text-slate-500">{log.target}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              total={OP_LOGS.length}
              page={logPage}
              pageSize={PAGE_SIZE}
              onPageChange={setLogPage}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
