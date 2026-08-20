import { setRequestLocale } from "next-intl/server";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

/** 用户控制台（客户端守卫，未登录跳转登录页） */
export default function DashboardPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <DashboardClient />;
}
