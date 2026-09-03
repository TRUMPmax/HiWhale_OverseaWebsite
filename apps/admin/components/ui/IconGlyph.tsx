"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  BatteryCharging,
  Bot,
  Boxes,
  Building2,
  Car,
  ClipboardCheck,
  Clock,
  Cog,
  Coins,
  Container,
  Cpu,
  Factory,
  Gauge,
  Globe,
  Layers,
  Leaf,
  Monitor,
  Network,
  Package,
  PackageOpen,
  Pill,
  Quote,
  Radar,
  Rocket,
  Route,
  ScanLine,
  Shapes,
  ShieldCheck,
  Ship,
  ShoppingCart,
  Snowflake,
  Sparkles,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { isPortalIconName, type PortalIconName } from "@hiwhale/shared/constants";

/** name → 组件映射（与 shared PORTAL_ICON_OPTIONS 一一对应；漏项 TS 报错） */
export const ICONS: Record<PortalIconName, LucideIcon> = {
  truck: Truck,
  bot: Bot,
  cog: Cog,
  container: Container,
  sparkles: Sparkles,
  "package-open": PackageOpen,
  monitor: Monitor,
  shapes: Shapes,
  zap: Zap,
  "shield-check": ShieldCheck,
  radar: Radar,
  wifi: Wifi,
  clock: Clock,
  package: Package,
  quote: Quote,
  "alert-triangle": AlertTriangle,
  boxes: Boxes,
  network: Network,
  warehouse: Warehouse,
  factory: Factory,
  timer: Timer,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  coins: Coins,
  gauge: Gauge,
  "battery-charging": BatteryCharging,
  leaf: Leaf,
  snowflake: Snowflake,
  pill: Pill,
  car: Car,
  ship: Ship,
  "shopping-cart": ShoppingCart,
  "building-2": Building2,
  cpu: Cpu,
  "scan-line": ScanLine,
  route: Route,
  "clipboard-check": ClipboardCheck,
  users: Users,
  award: Award,
  target: Target,
  rocket: Rocket,
  wrench: Wrench,
  globe: Globe,
  activity: Activity,
  layers: Layers,
};

/** 判断是否为自定义上传的图标 URL（/files 或 http 开头） */
export function isIconUrl(value: string): boolean {
  return value.startsWith("http") || value.startsWith("/");
}

/**
 * 统一图标渲染：白名单 name → lucide；URL → img；空/未知 → fallback（未给 → null）。
 */
export function IconGlyph({
  value,
  fallback: Fallback,
  className,
}: {
  value?: string | null;
  fallback?: LucideIcon | null;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  // 切换图标 URL 时重置加载失败状态（否则换新 URL 仍停留在回退）
  useEffect(() => setImgError(false), [value]);
  if (value && isPortalIconName(value)) {
    const Icon = ICONS[value];
    return <Icon className={className} aria-hidden="true" />;
  }
  if (value && isIconUrl(value) && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={value}
        alt=""
        aria-hidden="true"
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }
  if (!Fallback) return null;
  return <Fallback className={className} aria-hidden="true" />;
}
