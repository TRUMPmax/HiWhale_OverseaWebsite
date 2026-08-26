"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TrendPoint = { date: string; inquiries: number; ai: number };

/** 近 30 天趋势图：询盘数（品牌蓝）+ AI 对话量（琥珀）；无数据时显示空态 */
export function TrendChart({ data }: { data?: TrendPoint[] }) {
  const hasData = data && data.some((d) => d.inquiries > 0 || d.ai > 0);
  if (!hasData) {
    return (
      <div className="flex h-72 w-full items-center justify-center text-sm text-slate-400">
        暂无趋势数据
      </div>
    );
  }
  const chartData = data.map((d) => ({ date: d.date, 询盘数: d.inquiries, AI对话量: d.ai }));
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="询盘数"
            stroke="#1A56DB"
            fill="#1A56DB"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="AI对话量"
            stroke="#F59E0B"
            fill="#F59E0B"
            fillOpacity={0.12}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
