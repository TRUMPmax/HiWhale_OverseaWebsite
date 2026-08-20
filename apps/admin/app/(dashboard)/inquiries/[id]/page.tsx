"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Mail, MapPin, Phone, Send } from "lucide-react";
import {
  getLocalizedLabel,
  INQUIRY_STATUS_LABELS,
  InquiryStatus,
  PRODUCT_CATEGORY_LABELS,
} from "@hiwhale/shared/constants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { exportInquiriesCsv } from "@/lib/export-csv";
import { STAFF_OPTIONS } from "@/lib/mock/inquiries";
import { useInquiriesStore } from "@/store/inquiries";
import { useAdminAuthStore } from "@/store/auth";
import { STATUS_BADGE } from "@/components/inquiries/status-badge";

/** 询盘详情：客户信息 + 需求 + 意向产品 + 跟进时间线 + 状态/负责人操作 */
export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiry = useInquiriesStore((s) => s.inquiries.find((i) => i.id === params.id));
  const setStatus = useInquiriesStore((s) => s.setStatus);
  const assign = useInquiriesStore((s) => s.assign);
  const addFollowUp = useInquiriesStore((s) => s.addFollowUp);
  const adminName = useAdminAuthStore((s) => s.admin?.name ?? "管理员");
  const [draft, setDraft] = useState("");

  if (!inquiry) notFound();

  const submitFollowUp = () => {
    const text = draft.trim();
    if (!text) return;
    addFollowUp(inquiry.id, {
      ts: new Date().toLocaleString("zh-CN", { hour12: false }),
      author: adminName,
      note: text,
    });
    setDraft("");
    toast.success("跟进记录已添加");
  };

  return (
    <div className="space-y-6">
      {/* 顶部操作 */}
      <div className="flex items-center gap-3">
        <Link href="/inquiries">
          <Button variant="outline" size="sm">
            <ArrowLeft /> 返回列表
          </Button>
        </Link>
        <span className="font-mono text-xs text-slate-400">{inquiry.id}</span>
        <div className="ml-auto">
          <Button variant="outline" onClick={() => exportInquiriesCsv([inquiry])}>
            <Download /> 导出
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 左列：客户信息 + 意向产品 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">客户信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-brand-blue text-sm font-bold text-white">
                    {inquiry.customer.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-slate-900">{inquiry.customer}</div>
                  <div className="text-xs text-slate-500">{inquiry.company}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {inquiry.country}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {inquiry.email}
                </div>
                {inquiry.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {inquiry.phone}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">意向产品</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {inquiry.categories.map((c) => (
                  <Link key={c} href={`/products?category=${c}`}>
                    <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100">
                      {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, c, "zh")}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 状态与分配 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">状态与分配</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="text-xs text-slate-500">询盘状态</div>
                <Select
                  value={inquiry.status}
                  onValueChange={(v) => {
                    setStatus(inquiry.id, v as InquiryStatus);
                    toast.success("状态已更新");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InquiryStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {getLocalizedLabel(INQUIRY_STATUS_LABELS, s, "zh")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <div className="text-xs text-slate-500">负责人</div>
                <Select
                  value={inquiry.assignee ?? ""}
                  onValueChange={(v) => {
                    assign(inquiry.id, v || null);
                    toast.success("已分配负责人");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="未分配" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_OPTIONS.map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-slate-400">提交时间：{inquiry.createdAt}</div>
            </CardContent>
          </Card>
        </div>

        {/* 右列：需求 + 跟进 */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">需求描述</CardTitle>
              <Badge className={STATUS_BADGE[inquiry.status]}>
                {getLocalizedLabel(INQUIRY_STATUS_LABELS, inquiry.status, "zh")}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-700">{inquiry.message}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">跟进记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div
                  className="absolute bottom-2 left-1.5 top-2 w-px bg-slate-200"
                  aria-hidden="true"
                />
                <div className="space-y-5">
                  {inquiry.followUps.map((item, index) => (
                    <div key={`${item.ts}-${index}`} className="relative pl-7">
                      <span className="bg-brand-blue absolute left-1.5 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full ring-2 ring-white" />
                      <div className="text-sm font-medium text-slate-900">{item.author}</div>
                      <div className="text-xs text-slate-400">{item.ts}</div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.note}</p>
                    </div>
                  ))}
                  {inquiry.followUps.length === 0 && (
                    <p className="pl-7 text-sm text-slate-400">暂无跟进记录</p>
                  )}
                </div>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <Textarea
                  rows={3}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="添加一条跟进记录…"
                />
                <Button
                  className="bg-brand-blue hover:bg-brand-blue/90 mt-3"
                  onClick={submitFollowUp}
                  disabled={!draft.trim()}
                >
                  <Send /> 添加跟进
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
