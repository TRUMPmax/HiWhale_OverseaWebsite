import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HiWhale 管理后台",
  description: "HiWhale Robotics 运营管理后台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
