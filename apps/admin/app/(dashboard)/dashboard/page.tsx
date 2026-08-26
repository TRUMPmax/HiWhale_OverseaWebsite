"use client";

import { useEffect, useState } from "react";
import { Inbox, MessageSquareText, Users } from "lucide-react";
import {
  getLocalizedLabel,
  INQUIRY_STATUS_LABELS,
  PRODUCT_CATEGORY_LABELS,
} from "@hiwhale/shared/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { adminApi } from "@/lib/api";

type DashboardStats = {
  todayInquiries: number;
  monthUsers: number;
  aiConversations: number;
  trend: Array<{ date: string; inquiries: number; ai: number }>;
  recentInquiries: Array<{
    id: string;
    customer: string;
    company: string;
    country: string;
    categories: string[];
    status: string;
    time: string;
    assignee: string;
  }>;
};

const STATUS_BADGE: Record<string, string> = {
  NEW: "bg-blue-50 text-blue-700 hover:bg-blue-50",
  FOLLOWING: "bg-amber-50 text-amber-700 hover:bg-amber-50",
  WON: "bg-green-50 text-green-700 hover:bg-green-50",
  CLOSED: "bg-slate-100 text-slate-500 hover:bg-slate-100",
};

/** 仪表盘（统计数据来自 API） */
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminApi<DashboardStats>("/api/stats/dashboard")
      .then(setStats)
      .catch(() => {
        // API 不可用时保持空态
      });
  }, []);

  // 待办：由真实数据派生（新询盘待跟进）；无待办显示空态
  const newInquiryCount =
    stats?.recentInquiries.filter((i) => i.status === "NEW" && !i.assignee).length ?? 0;
  const todos =
    newInquiryCount > 0
      ? [
          {
            icon: Inbox,
            text: `${newInquiryCount} 条新询盘待跟进`,
            tone: "text-brand-blue bg-blue-50",
          },
        ]
      : [];

  const cards = [
    {
      title: "今日询盘",
      value: String(stats?.todayInquiries ?? "-"),
      delta: "实时数据",
      icon: Inbox,
    },
    {
      title: "本月新增用户",
      value: String(stats?.monthUsers ?? "-"),
      delta: "实时数据",
      icon: Users,
    },
    {
      title: "AI 对话量",
      value: String(stats?.aiConversations ?? "-"),
      delta: "累计会话数",
      icon: MessageSquareText,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        {cards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{stat.title}</span>
                <stat.icon className="text-brand-blue h-5 w-5" />
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</div>
              <div
                className={`mt-1 text-xs font-medium ${stat.delta.includes("示例") ? "text-slate-400" : "text-green-600"}`}
              >
                {stat.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 趋势图 */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-base">近30天趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={stats?.trend} />
          </CardContent>
        </Card>

        {/* 待办提醒 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">待办提醒</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.text}
                className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${todo.tone}`}
                >
                  <todo.icon className="h-4 w-4" />
                </span>
                <span className="text-sm text-slate-700">{todo.text}</span>
              </div>
            ))}
            {todos.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                {stats ? "全部处理完毕" : "加载中…"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 最近询盘 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近询盘</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>客户</TableHead>
                <TableHead>公司</TableHead>
                <TableHead>国家/地区</TableHead>
                <TableHead>意向品类</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>提交时间</TableHead>
                <TableHead>负责人</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(stats?.recentInquiries ?? []).map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.customer}</TableCell>
                  <TableCell>{inquiry.company}</TableCell>
                  <TableCell>{inquiry.country}</TableCell>
                  <TableCell>
                    {inquiry.categories
                      .map((c) => getLocalizedLabel(PRODUCT_CATEGORY_LABELS, c, "zh"))
                      .join(" / ")}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_BADGE[inquiry.status]}>
                      {getLocalizedLabel(INQUIRY_STATUS_LABELS, inquiry.status, "zh")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">{inquiry.time}</TableCell>
                  <TableCell>{inquiry.assignee}</TableCell>
                </TableRow>
              ))}
              {stats && stats.recentInquiries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-sm text-slate-400">
                    暂无询盘
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
