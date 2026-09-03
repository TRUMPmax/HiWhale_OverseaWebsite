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

/** name → 组件映射（与 shared PORTAL_ICON_OPTIONS 一一对应；漏项会被 TS 报错） */
const ICONS: Record<PortalIconName, LucideIcon> = {
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

/**
 * 图标渲染：白名单 name → lucide；自定义上传 URL（http 或 / 开头）→ img（加载失败回退）；
 * 空/未知 → fallbackName 经 ICONS 解析（未给 → 渲染 null，调用方版面需容忍无图标）。
 * client 组件：fallback 只能传名称字符串，不能从 Server Component 传组件引用。
 */
export function IconByName({
  name,
  fallbackName,
  className,
}: {
  name?: string | null;
  fallbackName?: PortalIconName;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);
  // 切换图标 URL 时重置加载失败状态（否则换新 URL 仍停留在回退）
  useEffect(() => setImgError(false), [name]);
  const Icon = (isPortalIconName(name) ? ICONS[name] : undefined) ?? null;
  if (Icon) return <Icon className={className} aria-hidden="true" />;
  if (name && (name.startsWith("http") || name.startsWith("/")) && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={name}
        alt=""
        aria-hidden="true"
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }
  const Fallback = fallbackName ? ICONS[fallbackName] : null;
  if (!Fallback) return null;
  return <Fallback className={className} aria-hidden="true" />;
}
