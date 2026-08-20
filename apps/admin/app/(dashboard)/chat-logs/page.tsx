"use client";

import { useState } from "react";
import { Download, Flag, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { Pagination } from "@/components/common/Pagination";
import { downloadCsv } from "@/lib/export-csv";
import { MOCK_CHAT_LOGS, type MockChatConversation } from "@/lib/mock/chat-logs";

const PAGE_SIZE = 8;

const STATUS_META: Record<MockChatConversation["status"], { label: string; className: string }> = {
  normal: { label: "正常", className: "bg-green-50 text-green-700 hover:bg-green-50" },
  flagged: { label: "已标注", className: "bg-amber-50 text-amber-700 hover:bg-amber-50" },
  review: { label: "待复核", className: "bg-red-50 text-red-600 hover:bg-red-50" },
};

const STATUS_CYCLE: Record<MockChatConversation["status"], MockChatConversation["status"]> = {
  normal: "flagged",
  flagged: "review",
  review: "normal",
};

/** AI 对话记录：搜索 + 查看对话 + 标注流转 + 导出 */
export default function ChatLogsPage() {
  const [logs, setLogs] = useState<MockChatConversation[]>(MOCK_CHAT_LOGS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<MockChatConversation | null>(null);

  const filtered = logs.filter((l) => l.user.toLowerCase().includes(search.toLowerCase()));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cycleStatus = (log: MockChatConversation) => {
    const next = STATUS_CYCLE[log.status];
    setLogs((prev) => prev.map((l) => (l.id === log.id ? { ...l, status: next } : l)));
    toast.success(`已更新为「${STATUS_META[next].label}」`);
  };

  const exportCsv = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    downloadCsv(
      `chat-logs-${date}.csv`,
      ["会话 ID", "用户", "消息数", "最近活跃", "状态"],
      filtered.map((l) => [
        l.id,
        l.user,
        String(l.messageCount),
        l.lastActive,
        STATUS_META[l.status].label,
      ]),
    );
    toast.success("已导出 CSV");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI 对话记录"
        description="查看门户 AI 助手对话记录"
        action={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="搜索用户…"
                className="w-56 pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button variant="outline" onClick={exportCsv}>
              <Download /> 导出记录
            </Button>
          </div>
        }
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>消息数</TableHead>
              <TableHead>最近活跃</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>{log.messageCount}</TableCell>
                <TableCell className="text-slate-500">{log.lastActive}</TableCell>
                <TableCell>
                  <Badge className={STATUS_META[log.status].className}>
                    {STATUS_META[log.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className="text-brand-blue text-sm font-medium hover:underline"
                    onClick={() => setViewing(log)}
                  >
                    查看对话
                  </button>
                  <button
                    type="button"
                    className="ml-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:underline"
                    onClick={() => cycleStatus(log)}
                  >
                    <Flag className="h-3.5 w-3.5" /> 标注
                  </button>
                </TableCell>
              </TableRow>
            ))}
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-sm text-slate-400">
                  暂无匹配的记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Pagination
          total={filtered.length}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {/* 完整对话弹窗 */}
      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>与 {viewing?.user} 的对话</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {viewing?.messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-brand-blue text-white"
                      : "bg-blue-50 text-slate-900"
                  }`}
                >
                  <div
                    className={`mb-0.5 text-[0.625rem] ${
                      message.role === "user" ? "text-white/60" : "text-slate-400"
                    }`}
                  >
                    {message.role === "user" ? viewing.user : "AI 助手"} · {message.ts}
                  </div>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
