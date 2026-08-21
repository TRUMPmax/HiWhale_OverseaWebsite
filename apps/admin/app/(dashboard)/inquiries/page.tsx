"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import {
  getLocalizedLabel,
  INQUIRY_STATUS_LABELS,
  InquiryStatus,
  PRODUCT_CATEGORY_LABELS,
} from "@hiwhale/shared/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { exportInquiriesCsv } from "@/lib/export-csv";
import { STATUS_BADGE } from "@/components/inquiries/status-badge";
import { useInquiriesStore } from "@/store/inquiries";

const PAGE_SIZE = 8;

/** 询盘管理列表：状态页签 + 搜索 + 导出 + 分页（数据来自 API） */
export default function InquiriesPage() {
  const inquiries = useInquiriesStore((s) => s.inquiries);
  const fetchInquiries = useInquiriesStore((s) => s.fetchInquiries);

  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    void fetchInquiries().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
  }, [fetchInquiries]);

  const countOf = (s: string) =>
    s === "all" ? inquiries.length : inquiries.filter((i) => i.status === s).length;

  const filtered = inquiries.filter((i) => {
    const matchStatus = status === "all" || i.status === status;
    const keyword = search.toLowerCase();
    const matchSearch =
      i.customer.toLowerCase().includes(keyword) ||
      i.company.toLowerCase().includes(keyword) ||
      i.country.toLowerCase().includes(keyword);
    return matchStatus && matchSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const statusTabs = [
    { value: "all", label: "全部" },
    ...Object.values(InquiryStatus).map((s) => ({
      value: s,
      label: getLocalizedLabel(INQUIRY_STATUS_LABELS, s, "zh"),
    })),
  ];

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex items-center gap-3">
        <Tabs
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <TabsList>
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}（{countOf(tab.value)}）
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="搜索客户 / 公司 / 国家…"
            className="w-64 pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button variant="outline" onClick={() => exportInquiriesCsv(filtered)}>
          <Download /> 导出 Excel
        </Button>
      </div>

      {/* 列表 */}
      <div className="rounded-xl border border-slate-200 bg-white">
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
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium">{inquiry.customer}</TableCell>
                <TableCell>{inquiry.company}</TableCell>
                <TableCell>{inquiry.country}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {inquiry.categories.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700"
                      >
                        {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, c, "zh")}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={STATUS_BADGE[inquiry.status]}>
                    {getLocalizedLabel(INQUIRY_STATUS_LABELS, inquiry.status, "zh")}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500">{inquiry.createdAt}</TableCell>
                <TableCell>
                  {inquiry.assignee ?? <span className="text-slate-400">未分配</span>}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/inquiries/${inquiry.id}`}
                    className="text-brand-blue text-sm font-medium hover:underline"
                  >
                    查看
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-sm text-slate-400">
                  暂无匹配的询盘
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <span className="text-xs text-slate-500">共 {filtered.length} 条</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              上一页
            </Button>
            <span className="text-xs text-slate-500">
              第 {currentPage}/{totalPages} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
