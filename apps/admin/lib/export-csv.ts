import {
  getLocalizedLabel,
  INQUIRY_STATUS_LABELS,
  PRODUCT_CATEGORY_LABELS,
} from "@hiwhale/shared/constants";
import type { MockAdminInquiry } from "@/lib/mock/inquiries";

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** 将询盘列表导出为 CSV（带 BOM，Excel 中文兼容）并触发下载 */
export function exportInquiriesCsv(rows: MockAdminInquiry[]): void {
  const header = [
    "询盘编号",
    "客户",
    "公司",
    "国家/地区",
    "邮箱",
    "电话",
    "意向品类",
    "状态",
    "提交时间",
    "负责人",
  ];
  const lines = rows.map((i) =>
    [
      i.id,
      i.customer,
      i.company,
      i.country,
      i.email,
      i.phone ?? "",
      i.categories.map((c) => getLocalizedLabel(PRODUCT_CATEGORY_LABELS, c, "zh")).join("/"),
      getLocalizedLabel(INQUIRY_STATUS_LABELS, i.status, "zh"),
      i.createdAt,
      i.assignee ?? "未分配",
    ]
      .map(escapeCsv)
      .join(","),
  );
  const csv = "﻿" + [header.map(escapeCsv).join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  a.href = url;
  a.download = `inquiries-${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
