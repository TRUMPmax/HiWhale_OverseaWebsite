"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  FlaskConical,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_PRODUCTS } from "@hiwhale/shared/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { adminApi, adminApiText, API_BASE } from "@/lib/api";
import { useAdminAuthStore } from "@/store/auth";
import { useProductsStore } from "@/store/products";

type KbDoc = {
  id: string;
  fileName: string;
  type: string;
  product: string;
  uploadedAt: string;
  vectorStatus: "done" | "processing" | "failed";
};

type ApiDoc = {
  id: string;
  fileName: string;
  fileType: string;
  productModel: string | null;
  createdAt: string;
  vectorStatus: "DONE" | "PROCESSING" | "FAILED" | "PENDING";
};

type Faq = {
  id: string;
  question: string;
  answer: string;
  questionEn?: string | null;
  answerEn?: string | null;
};

const VECTOR_BADGE: Record<KbDoc["vectorStatus"], { label: string; className: string }> = {
  done: { label: "已完成", className: "bg-green-50 text-green-700 hover:bg-green-50" },
  processing: { label: "处理中", className: "bg-amber-50 text-amber-700 hover:bg-amber-50" },
  failed: { label: "失败", className: "bg-red-50 text-red-600 hover:bg-red-50" },
};

function toDoc(d: ApiDoc): KbDoc {
  return {
    id: d.id,
    fileName: d.fileName,
    type: d.fileType,
    product: d.productModel ?? "通用",
    uploadedAt: d.createdAt.slice(0, 10),
    vectorStatus:
      d.vectorStatus === "DONE" ? "done" : d.vectorStatus === "FAILED" ? "failed" : "processing",
  };
}

/** AI 知识库：文档管理 / FAQ 管理 / 测试问答（数据来自 API） */
export default function KnowledgeBasePage() {
  const [docs, setDocs] = useState<KbDoc[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadProduct, setUploadProduct] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [faqDialog, setFaqDialog] = useState<{ open: boolean; editing: Faq | null }>({
    open: false,
    editing: null,
  });
  const [faqDraft, setFaqDraft] = useState({
    question: "",
    answer: "",
    questionEn: "",
    answerEn: "",
  });
  const [pendingDeleteFaq, setPendingDeleteFaq] = useState<Faq | null>(null);
  const [importing, setImporting] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [pendingDeleteDoc, setPendingDeleteDoc] = useState<KbDoc | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  const fetchDocs = async () => {
    const data = await adminApi<ApiDoc[]>("/api/knowledge/documents");
    setDocs(data.map(toDoc));
  };
  const fetchFaqs = async () => {
    setFaqs(await adminApi<Faq[]>("/api/knowledge/faqs"));
  };

  useEffect(() => {
    void fetchDocs().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
    void fetchFaqs().catch((e) => toast.error(e instanceof Error ? e.message : "加载失败"));
    if (products.length === 0) {
      void fetchProducts().catch(() => toast.error("产品列表加载失败，已回退到内置数据"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retryVectorize = (doc: KbDoc) => {
    void doc;
    toast.info("向量化管线将在后续阶段接入（当前文档保持处理中状态）");
  };

  const submitUpload = async () => {
    if (!uploadFile) {
      toast.error("请选择文档文件");
      return;
    }
    setUploading(true);
    try {
      const token = useAdminAuthStore.getState().token;
      const fd = new FormData();
      fd.append("file", uploadFile);
      const res = await fetch(
        `${API_BASE}/api/knowledge/documents${uploadProduct ? `?productModel=${encodeURIComponent(uploadProduct)}` : ""}`,
        { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? "上传失败");
      }
      toast.success("文档已上传，向量化处理中");
      setUploadOpen(false);
      setUploadFile(null);
      setUploadProduct("");
      await fetchDocs();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const submitFaq = async () => {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) {
      toast.error("请填写问题与答案");
      return;
    }
    const body = {
      question: faqDraft.question.trim(),
      answer: faqDraft.answer.trim(),
      ...(faqDraft.questionEn.trim() ? { questionEn: faqDraft.questionEn.trim() } : {}),
      ...(faqDraft.answerEn.trim() ? { answerEn: faqDraft.answerEn.trim() } : {}),
    };
    try {
      if (faqDialog.editing) {
        await adminApi(`/api/knowledge/faqs/${faqDialog.editing.id}`, {
          method: "PUT",
          body,
        });
      } else {
        await adminApi("/api/knowledge/faqs", { method: "POST", body });
      }
      toast.success("保存成功");
      setFaqDialog({ open: false, editing: null });
      await fetchFaqs();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };

  /** 导出 FAQ 为 CSV（UTF-8 带 BOM，Excel 可直接编辑） */
  const exportFaqs = async () => {
    try {
      const csv = await adminApiText("/api/knowledge/faqs/export");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `faqs-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "导出失败");
    }
  };

  /** 导入 CSV（追加模式，重复问题跳过） */
  const importFaqs = async (file: File) => {
    setImporting(true);
    try {
      const csv = await file.text();
      const result = await adminApi<{ imported: number; skipped: number; invalid: number }>(
        "/api/knowledge/faqs/import",
        { method: "POST", body: { csv } },
      );
      toast.success(
        `导入完成：新增 ${result.imported} 条，跳过重复 ${result.skipped} 条` +
          (result.invalid > 0 ? `，格式无效 ${result.invalid} 行` : ""),
      );
      await fetchFaqs();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "导入失败");
    } finally {
      setImporting(false);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  const askQuestion = () => {
    if (!question.trim()) return;
    setAnswer(
      "测试问答将在向量检索管线接入后可用（当前为占位提示：文档已可上传入库，检索/重排见开发指南 6.4-6.5）。",
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI 知识库" description="管理知识库文档、FAQ 与问答效果" />

      <Tabs defaultValue="docs">
        <TabsList>
          <TabsTrigger value="docs">文档管理</TabsTrigger>
          <TabsTrigger value="faq">FAQ 管理</TabsTrigger>
          <TabsTrigger value="test">测试问答</TabsTrigger>
        </TabsList>

        {/* 文档管理 */}
        <TabsContent value="docs" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              className="bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => setUploadOpen(true)}
            >
              <Upload /> 上传文档
            </Button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>文件名</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>关联产品</TableHead>
                  <TableHead>上传时间</TableHead>
                  <TableHead>向量化状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.fileName}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell className="font-mono text-xs">{doc.product}</TableCell>
                    <TableCell className="text-slate-500">{doc.uploadedAt}</TableCell>
                    <TableCell>
                      <Badge className={VECTOR_BADGE[doc.vectorStatus].className}>
                        {VECTOR_BADGE[doc.vectorStatus].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {doc.vectorStatus === "failed" && (
                        <Button variant="outline" size="sm" onClick={() => retryVectorize(doc)}>
                          <RotateCcw /> 重试
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="删除文档"
                        onClick={() => setPendingDeleteDoc(doc)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {docs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-sm text-slate-400">
                      暂无文档
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* FAQ 管理 */}
        <TabsContent value="faq" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              支持 CSV 批量维护：列顺序 question, answer, questionEn, answerEn（Excel 可直接编辑）
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => void exportFaqs()}>
                <Download /> 导出 CSV
              </Button>
              <Button
                variant="outline"
                disabled={importing}
                onClick={() => importInputRef.current?.click()}
              >
                <Upload /> {importing ? "导入中…" : "导入 CSV"}
              </Button>
              <input
                ref={importInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void importFaqs(file);
                }}
              />
              <Button
                className="bg-brand-blue hover:bg-brand-blue/90"
                onClick={() => {
                  setFaqDraft({ question: "", answer: "", questionEn: "", answerEn: "" });
                  setFaqDialog({ open: true, editing: null });
                }}
              >
                <Plus /> 新增 FAQ
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">{faq.question}</div>
                    {faq.questionEn && (
                      <div className="mt-0.5 text-xs text-slate-400">{faq.questionEn}</div>
                    )}
                    <div className="mt-1 text-sm text-slate-600">{faq.answer}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="编辑"
                    onClick={() => {
                      setFaqDraft({
                        question: faq.question,
                        answer: faq.answer,
                        questionEn: faq.questionEn ?? "",
                        answerEn: faq.answerEn ?? "",
                      });
                      setFaqDialog({ open: true, editing: faq });
                    }}
                  >
                    <Pencil className="h-4 w-4 text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="删除"
                    onClick={() => setPendingDeleteFaq(faq)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
            {faqs.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-400">暂无 FAQ</p>
            )}
          </div>
        </TabsContent>

        {/* 测试问答 */}
        <TabsContent value="test" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FlaskConical className="text-brand-blue h-4 w-4" /> 测试问答
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-400">
                接入向量检索后可用（占位：文档入库已通，检索/重排待实现）
              </p>
              <div className="flex gap-3">
                <Input
                  placeholder="输入测试问题，如：无人叉车载重多少？"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askQuestion()}
                />
                <Button
                  className="bg-brand-blue hover:bg-brand-blue/90"
                  onClick={askQuestion}
                  disabled={!question.trim()}
                >
                  <Send /> 提问
                </Button>
              </div>
              {answer && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-medium text-slate-500">提示</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{answer}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 上传文档弹窗 */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上传文档</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="hover:border-brand-blue flex h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 text-center transition-colors">
              <input
                type="file"
                className="hidden"
                accept=".pdf,.md,.txt,.docx"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
              <Upload className="h-6 w-6 text-slate-400" />
              <span className="text-xs text-slate-500">
                {uploadFile ? uploadFile.name : "点击选择 PDF / MD / TXT / DOCX 文档（≤20MB）"}
              </span>
            </label>
            <div className="space-y-1.5">
              <Label>关联产品</Label>
              <select
                className="border-input bg-background focus:border-brand-blue flex h-9 w-full rounded-md border px-3 text-sm outline-none"
                value={uploadProduct}
                onChange={(e) => setUploadProduct(e.target.value)}
              >
                <option value="">通用</option>
                {(products.length > 0 ? products : MOCK_PRODUCTS).map((p) => (
                  <option key={p.slug} value={p.model}>
                    {p.name.zh}（{p.model}）
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              取消
            </Button>
            <Button
              className="bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => void submitUpload()}
              disabled={uploading}
            >
              {uploading ? "上传中…" : "上传"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ 编辑弹窗 */}
      <Dialog open={faqDialog.open} onOpenChange={(open) => setFaqDialog({ open, editing: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{faqDialog.editing ? "编辑 FAQ" : "新增 FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>问题（中文）</Label>
                <Input
                  value={faqDraft.question}
                  onChange={(e) => setFaqDraft((d) => ({ ...d, question: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>问题（英文，可选）</Label>
                <Input
                  value={faqDraft.questionEn}
                  onChange={(e) => setFaqDraft((d) => ({ ...d, questionEn: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>答案（中文）</Label>
              <Textarea
                rows={4}
                value={faqDraft.answer}
                onChange={(e) => setFaqDraft((d) => ({ ...d, answer: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>答案（英文，可选）</Label>
              <Textarea
                rows={4}
                value={faqDraft.answerEn}
                onChange={(e) => setFaqDraft((d) => ({ ...d, answerEn: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialog({ open: false, editing: null })}>
              取消
            </Button>
            <Button
              className="bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => void submitFaq()}
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={pendingDeleteFaq !== null}
        onOpenChange={(open) => !open && setPendingDeleteFaq(null)}
        name={pendingDeleteFaq?.question ?? ""}
        onConfirm={() => {
          if (pendingDeleteFaq) {
            void adminApi(`/api/knowledge/faqs/${pendingDeleteFaq.id}`, { method: "DELETE" })
              .then(() => fetchFaqs())
              .then(() => toast.success("已删除"))
              .catch((e) => toast.error(e instanceof Error ? e.message : "删除失败"));
          }
        }}
      />
      <ConfirmDeleteDialog
        open={pendingDeleteDoc !== null}
        onOpenChange={(open) => !open && setPendingDeleteDoc(null)}
        name={pendingDeleteDoc?.fileName ?? ""}
        onConfirm={() => {
          if (pendingDeleteDoc) {
            void adminApi(`/api/knowledge/documents/${pendingDeleteDoc.id}`, { method: "DELETE" })
              .then(() => fetchDocs())
              .then(() => toast.success("已删除"))
              .catch((e) => toast.error(e instanceof Error ? e.message : "删除失败"));
          }
        }}
      />
    </div>
  );
}
