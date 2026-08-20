import { redirect } from "next/navigation";

/** 根路径直接进入控制台（未登录由守卫重定向到 /login） */
export default function RootPage() {
  redirect("/dashboard");
}
