/**
 * 门户可选图标白名单（纯数据）。
 * 各端（portal IconByName / admin IconPicker）各自维护 name → lucide 组件的映射，
 * 并用 PortalIconName 联合类型约束，保证白名单与组件映射不漂移。
 * 注意：本文件被 api/prisma/seed.js 间接加载，禁止引入 React/lucide-react。
 */
export const PORTAL_ICON_OPTIONS = [
  { name: "truck", zh: "运输/叉车" },
  { name: "bot", zh: "机器人" },
  { name: "cog", zh: "机械/设置" },
  { name: "container", zh: "集装箱" },
  { name: "sparkles", zh: "洁净/闪耀" },
  { name: "package-open", zh: "拆包/配送" },
  { name: "monitor", zh: "软件/屏幕" },
  { name: "shapes", zh: "通用/其他" },
  { name: "zap", zh: "高效/速度" },
  { name: "shield-check", zh: "安全/合规" },
  { name: "radar", zh: "感知/雷达" },
  { name: "wifi", zh: "互联/通讯" },
  { name: "clock", zh: "时间/周期" },
  { name: "package", zh: "设备/包裹" },
  { name: "quote", zh: "证言/引用" },
  { name: "alert-triangle", zh: "痛点/警告" },
  { name: "boxes", zh: "仓储/箱体" },
  { name: "network", zh: "系统/网络" },
  { name: "warehouse", zh: "仓库" },
  { name: "factory", zh: "工厂" },
  { name: "timer", zh: "效率/计时" },
  { name: "trending-up", zh: "增长" },
  { name: "trending-down", zh: "下降/降本" },
  { name: "coins", zh: "成本/回报" },
  { name: "gauge", zh: "性能/仪表" },
  { name: "battery-charging", zh: "续航/能源" },
  { name: "leaf", zh: "环保" },
  { name: "snowflake", zh: "冷链" },
  { name: "pill", zh: "医药" },
  { name: "car", zh: "汽车" },
  { name: "ship", zh: "港口/航运" },
  { name: "shopping-cart", zh: "电商/零售" },
  { name: "building-2", zh: "企业/楼宇" },
  { name: "cpu", zh: "芯片/算力" },
  { name: "scan-line", zh: "识别/扫码" },
  { name: "route", zh: "路径/调度" },
  { name: "clipboard-check", zh: "验收/清单" },
  { name: "users", zh: "人力/团队" },
  { name: "award", zh: "认证/荣誉" },
  { name: "target", zh: "目标/精准" },
  { name: "rocket", zh: "上线/提速" },
  { name: "wrench", zh: "运维/工具" },
  { name: "globe", zh: "全球/网络" },
  { name: "activity", zh: "运行/监控" },
  { name: "layers", zh: "分层/集成" },
] as const;

export type PortalIconName = (typeof PORTAL_ICON_OPTIONS)[number]["name"];

export function isPortalIconName(name: unknown): name is PortalIconName {
  return typeof name === "string" && PORTAL_ICON_OPTIONS.some((o) => o.name === name);
}

/** 产品大类默认图标（DB ProductGroupEntity.icon 为空时的回退；亦用于 seed 初始值） */
export const DEFAULT_GROUP_ICONS: Record<string, PortalIconName> = {
  FORKLIFT: "truck",
  MOBILE_ROBOT: "bot",
  ROBOTIC_ARM: "cog",
  GANTRY_CRANE: "container",
  CLEANING_ROBOT: "sparkles",
  DELIVERY_ROBOT: "package-open",
  SOFTWARE: "monitor",
};
