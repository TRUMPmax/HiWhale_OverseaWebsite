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
import { adminApi } from "@/lib/api";
import { Pagination } from "@/components/common/Pagination";

const PAGE_SIZE = 8;

/** 系统设置：基本信息（真实保存） / 操作日志（SMTP 与通知不实装，纯海外站无邮件环节） */
export default function SettingsPage() {
  const [siteName, setSiteName] = useState("HiWhale Robotics");
  const [defaultLocale, setDefaultLocale] = useState("en");
  const [logPage, setLogPage] = useState(1);
  const [logs, setLogs] = useState<
    Array<{ id: string; time: string; operator: string; action: string; target: string }>
  >([]);
  const [logsTotal, setLogsTotal] = useState(0);

  // 基本信息：挂载时加载已存设置
  useEffect(() => {
    adminApi<{ value: { siteName?: string; defaultLocale?: string } | null }>(
      `/api/settings/site-basic`,
    )
      .then((data) => {
        if (data.value?.siteName) setSiteName(data.value.siteName);
        if (data.value?.defaultLocale) setDefaultLocale(data.value.defaultLocale);
      })
      .catch(() => {});
  }, []);

  const saveBasic = () => {
    void adminApi(`/api/settings/site-basic`, {
      method: "PUT",
      body: { value: { siteName, defaultLocale } },
    })
      .then(() => toast.success("保存成功"))
      .catch((e) => toast.error(e instanceof Error ? e.message : "保存失败"));
  };

  useEffect(() => {
    adminApi<{ items: typeof logs; total: number }>(`/api/logs?page=${logPage}`)
      .then((data) => {
        setLogs(data.items);
        setLogsTotal(data.total);
      })
      .catch(() => {});
  }, [logPage]);

  return (
    <div className="space-y-6">
      <PageHeader title="系统设置" description="系统参数与操作日志" />

      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">基本信息</TabsTrigger>
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
              <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={saveBasic}>
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
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-slate-500">
                      {new Date(log.time).toLocaleString("zh-CN", { hour12: false })}
                    </TableCell>
                    <TableCell>{log.operator}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="text-slate-500">{log.target}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              total={logsTotal}
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
