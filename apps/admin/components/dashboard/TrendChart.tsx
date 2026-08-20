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

/** 确定性伪随机（保证每次渲染数据一致） */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 近 30 天 Mock 趋势数据 */
const DATA = (() => {
  const rand = mulberry32(20260820);
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 86400000);
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    return {
      date: label,
      询盘数: Math.round(4 + rand() * 14 + i * 0.25),
      AI对话量: Math.round(20 + rand() * 45 + i * 1.5),
    };
  });
})();

/** 近 30 天趋势图：询盘数（品牌蓝）+ AI 对话量（琥珀） */
export function TrendChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
