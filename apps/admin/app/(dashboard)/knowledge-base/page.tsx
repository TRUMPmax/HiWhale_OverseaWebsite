"use client";

import { useState } from "react";
import { FlaskConical, Pencil, Plus, RotateCcw, Send, Trash2, Upload } from "lucide-react";
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

type KbDoc = {
  id: string;
  fileName: string;
  type: string;
  product: string;
  uploadedAt: string;
  vectorStatus: "done" | "processing" | "failed";
};

type Faq = {
  id: string;
  question: string;
  answer: string;
};

const INITIAL_DOCS: KbDoc[] = [
  {
    id: "doc-1",
    fileName: "MBV15R-产品规格书.pdf",
    type: "PDF",
    product: "MBV15R",
    uploadedAt: "2026-08-15",
    vectorStatus: "done",
  },
  {
    id: "doc-2",
    fileName: "WCS-系统对接指南.docx",
    type: "DOCX",
    product: "MBW-WCS",
    uploadedAt: "2026-08-14",
    vectorStatus: "done",
  },
  {
    id: "doc-3",
    fileName: "冷链方案白皮书.pdf",
    type: "PDF",
    product: "通用",
    uploadedAt: "2026-08-12",
    vectorStatus: "processing",
  },
  {
    id: "doc-4",
    fileName: "AMR-安全手册.pdf",
    type: "PDF",
    product: "MBH08L",
    uploadedAt: "2026-08-10",
    vectorStatus: "failed",
  },
];

const INITIAL_FAQS: Faq[] = [
  {
    id: "faq-1",
    question: "无人叉车的最小通道宽度是多少？",
    answer: "MBV15R 最小通道宽度 1,750 mm，MBV20P 窄巷道作业最小 2,200 mm。",
  },
  {
    id: "faq-2",
    question: "设备支持哪些认证？",
    answer: "全系列通过 CE 认证，无人叉车符合 ISO 3691-4，北美项目可选 UL 认证。",
  },
];

const VECTOR_BADGE: Record<KbDoc["vectorStatus"], { label: string; className: string }> = {
  done: { label: "已完成", className: "bg-green-50 text-green-700 hover:bg-green-50" },
  processing: { label: "处理中", className: "bg-amber-50 text-amber-700 hover:bg-amber-50" },
  failed: { label: "失败", className: "bg-red-50 text-red-600 hover:bg-red-50" },
};

/** AI 知识库：文档管理 / FAQ 管理 / 测试问答 */
export default function KnowledgeBasePage() {
  const [docs, setDocs] = useState<KbDoc[]>(INITIAL_DOCS);
  const [faqs, setFaqs] = useState<Faq[]>(INITIAL_FAQS);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadProduct, setUploadProduct] = useState("");
  const [faqDialog, setFaqDialog] = useState<{ open: boolean; editing: Faq | null }>({
    open: false,
    editing: null,
  });
  const [faqDraft, setFaqDraft] = useState({ question: "", answer: "" });
  const [pendingDeleteFaq, setPendingDeleteFaq] = useState<Faq | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  const retryVectorize = (doc: KbDoc) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, vectorStatus: "processing" } : d)),
    );
    toast.success("已重新提交向量化任务");
    window.setTimeout(() => {
      setDocs((prev) => prev.map((d) => (d.id === doc.id ? { ...d, vectorStatus: "done" } : d)));
      toast.success(`「${doc.fileName}」向量化完成`);
    }, 2000);
  };

  const submitUpload = () => {
    if (!uploadProduct) {
      toast.error("请选择关联产品");
      return;
    }
    setDocs((prev) => [
      {
        id: `doc-${Date.now()}`,
        fileName: "新上传文档.pdf",
        type: "PDF",
        product: uploadProduct,
        uploadedAt: new Date().toISOString().slice(0, 10),
        vectorStatus: "processing",
      },
      ...prev,
    ]);
    toast.success("文档已上传，向量化处理中");
    setUploadOpen(false);
    setUploadProduct("");
  };

  const submitFaq = () => {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) {
      toast.error("请填写问题与答案");
      return;
    }
    if (faqDialog.editing) {
      setFaqs((prev) =>
        prev.map((f) => (f.id === faqDialog.editing!.id ? { ...f, ...faqDraft } : f)),
      );
    } else {
      setFaqs((prev) => [{ id: `faq-${Date.now()}`, ...faqDraft }, ...prev]);
    }
    toast.success("保存成功");
    setFaqDialog({ open: false, editing: null });
  };

  const askQuestion = () => {
    if (!question.trim()) return;
    setAnswer(
      "根据知识库内容：浩鲸无人叉车额定载重覆盖 1.5–2 吨，AMR 负载 800–1,200 kg，全系通过 CE / ISO 3691-4 认证。更详细信息请参考下方引用文档。",
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* FAQ 管理 */}
        <TabsContent value="faq" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              className="bg-brand-blue hover:bg-brand-blue/90"
              onClick={() => {
                setFaqDraft({ question: "", answer: "" });
                setFaqDialog({ open: true, editing: null });
              }}
            >
              <Plus /> 新增 FAQ
            </Button>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">{faq.question}</div>
                    <div className="mt-1 text-sm text-slate-600">{faq.answer}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="编辑"
                    onClick={() => {
                      setFaqDraft({ question: faq.question, answer: faq.answer });
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
                  <div className="text-xs font-medium text-slate-500">AI 回答（Mock）</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{answer}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["MBV15R-产品规格书.pdf", "AMR-安全手册.pdf"].map((source) => (
                      <span
                        key={source}
                        className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                      >
                        引用：{source}
                      </span>
                    ))}
                  </div>
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
            <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 text-center">
              <Upload className="h-6 w-6 text-slate-400" />
              <span className="text-xs text-slate-500">
                点击或拖拽上传 PDF / DOCX（占位，后端就绪后接 MinIO）
              </span>
            </div>
            <div className="space-y-1.5">
              <Label>关联产品</Label>
              <select
                className="border-input bg-background focus:border-brand-blue flex h-9 w-full rounded-md border px-3 text-sm outline-none"
                value={uploadProduct}
                onChange={(e) => setUploadProduct(e.target.value)}
              >
                <option value="">请选择产品</option>
                <option value="通用">通用</option>
                {MOCK_PRODUCTS.map((p) => (
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
            <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={submitUpload}>
              上传
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
            <div className="space-y-1.5">
              <Label>问题</Label>
              <Input
                value={faqDraft.question}
                onChange={(e) => setFaqDraft((d) => ({ ...d, question: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>答案</Label>
              <Textarea
                rows={4}
                value={faqDraft.answer}
                onChange={(e) => setFaqDraft((d) => ({ ...d, answer: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFaqDialog({ open: false, editing: null })}>
              取消
            </Button>
            <Button className="bg-brand-blue hover:bg-brand-blue/90" onClick={submitFaq}>
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
            setFaqs((prev) => prev.filter((f) => f.id !== pendingDeleteFaq.id));
          }
          toast.success("已删除");
        }}
      />
    </div>
  );
}
