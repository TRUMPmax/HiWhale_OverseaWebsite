"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Package, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  getGroupOfCategory,
  getLocalizedLabel,
  PRODUCT_CATEGORY_GROUPS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GROUP_LABELS,
} from "@hiwhale/shared/constants";
import type { ProductCategory } from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProductsStore, type AdminProduct, type ProductPayload } from "@/store/products";
import { useAdminAuthStore } from "@/store/auth";

const schema = z.object({
  nameZh: z.string().min(1, "请输入中文名称"),
  nameEn: z.string().min(1, "请输入英文名称"),
  model: z.string().min(1, "请输入型号"),
  category: z.string().min(1, "请选择品类"),
  description: z.string(),
  status: z.boolean(),
  quickSpecs: z.array(z.object({ label: z.string(), value: z.string() })),
  features: z.array(z.object({ text: z.string() })),
});
type FormValues = z.infer<typeof schema>;

type ProductFormProps = {
  /** 编辑模式传入（store 记录，含完整字段） */
  initial?: { record: AdminProduct };
};

/** 产品新增/编辑表单（真实 API + MinIO 素材上传/删除） */
export function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);
  /** 产品图片（第一张为主图，最多 4 张） */
  const [images, setImages] = useState<string[]>(() => {
    const urls = initial?.record.imageUrls;
    if (urls && urls.length > 0) return urls;
    return initial?.record.imageUrl ? [initial.record.imageUrl] : [];
  });
  const [spec, setSpec] = useState(initial?.record.specUrl ?? "");
  const [model3d, setModel3d] = useState(initial?.record.modelUrl ?? "");
  const [uploading, setUploading] = useState<"image" | "spec" | "model3d" | null>(null);

  /** 上传素材到 MinIO（经 API） */
  const uploadAsset = async (kind: "image" | "spec" | "model3d", file: File) => {
    if (kind === "image" && images.length >= 4) {
      toast.error("最多上传 4 张图片");
      return;
    }
    setUploading(kind);
    try {
      const token = useAdminAuthStore.getState().token;
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/uploads?kind=${kind === "model3d" ? "model" : kind}`,
        { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: fd },
      );
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok || !data.url) throw new Error(data.message ?? "上传失败");
      if (kind === "image") setImages((prev) => [...prev, data.url!]);
      else if (kind === "spec") setSpec(data.url);
      else setModel3d(data.url);
      toast.success("上传成功");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(null);
    }
  };

  /** 删除 MinIO 对象（404 时视为已删除，同步移除本地状态） */
  const deleteAsset = async (url: string, apply: () => void) => {
    const key = url.split("hiwhale-uploads/")[1];
    try {
      const token = useAdminAuthStore.getState().token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/uploads`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ key }),
        },
      );
      if (!res.ok && res.status !== 404) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? "删除失败");
      }
      apply();
      toast.success("已删除");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "删除失败");
    }
  };

  /** 从 URL 提取文件名 */
  const fileNameOf = (url: string) => url.split("/").pop() ?? url;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          nameZh: initial.record.name.zh,
          nameEn: initial.record.name.en,
          model: initial.record.model,
          category: initial.record.category,
          description: initial.record.description.zh,
          status: initial.record.status === "on",
          quickSpecs: initial.record.quickSpecs.map((s) => ({
            label: s.label.zh,
            value: s.value,
          })),
          features: initial.record.features.map((f) => ({ text: f.zh })),
        }
      : {
          nameZh: "",
          nameEn: "",
          model: "",
          category: "",
          description: "",
          status: true,
          quickSpecs: [{ label: "", value: "" }],
          features: [{ text: "" }],
        },
  });

  const specs = useFieldArray({ control, name: "quickSpecs" });
  const features = useFieldArray({ control, name: "features" });

  const onSubmit = async (values: FormValues) => {
    const category = values.category as ProductCategory;
    const payload: ProductPayload = {
      slug: initial?.record.slug ?? `custom-${Date.now()}`,
      model: values.model,
      category,
      group: getGroupOfCategory(category),
      name: { zh: values.nameZh, en: values.nameEn },
      tagline: initial?.record.tagline ?? { zh: "", en: "" },
      description: { zh: values.description, en: values.description },
      quickSpecs: values.quickSpecs
        .filter((r) => r.label.trim() && r.value.trim())
        .map((r) => ({ label: { zh: r.label, en: r.label }, value: r.value })),
      specGroups: initial?.record.specGroups ?? [],
      features: values.features
        .filter((f) => f.text.trim())
        .map((f) => ({ zh: f.text, en: f.text })),
      scenarios: initial?.record.scenarios ?? [],
      imageName: initial?.record.imageName ?? `product-${values.model.toLowerCase()}.png`,
      imageUrl: images[0] ?? null,
      imageUrls: images,
      specUrl: spec || null,
      modelUrl: model3d || null,
      status: values.status ? "on" : "off",
    };
    try {
      if (initial) {
        await updateProduct(initial.record.id, payload);
      } else {
        await addProduct(payload);
      }
      toast.success("保存成功");
      router.push("/products");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本信息</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>产品名称（中文）*</Label>
            <Input {...register("nameZh")} />
            {errors.nameZh && <p className="text-xs text-red-600">{errors.nameZh.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>产品名称（英文）*</Label>
            <Input {...register("nameEn")} />
            {errors.nameEn && <p className="text-xs text-red-600">{errors.nameEn.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>型号 *</Label>
            <Input {...register("model")} />
            {errors.model && <p className="text-xs text-red-600">{errors.model.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>品类 *</Label>
            <select
              className="border-input bg-background focus:border-brand-blue flex h-9 w-full rounded-md border px-3 text-sm outline-none"
              {...register("category")}
            >
              <option value="">请选择品类</option>
              {PRODUCT_CATEGORY_GROUPS.map(({ group, categories }) => (
                <optgroup key={group} label={getLocalizedLabel(PRODUCT_GROUP_LABELS, group, "zh")}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {getLocalizedLabel(PRODUCT_CATEGORY_LABELS, category, "zh")}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>描述</Label>
            <Textarea rows={3} {...register("description")} />
          </div>
          <label className="col-span-2 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="accent-brand-blue h-4 w-4" {...register("status")} />
            上架（在门户产品列表中可见）
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">核心参数</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => specs.append({ label: "", value: "" })}
          >
            <Plus /> 添加参数
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {specs.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <Input
                placeholder="参数名，如：额定载重"
                {...register(`quickSpecs.${index}.label`)}
              />
              <Input
                placeholder="参数值，如：1,500 kg"
                {...register(`quickSpecs.${index}.value`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="删除参数"
                onClick={() => specs.remove(index)}
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">产品卖点</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => features.append({ text: "" })}
          >
            <Plus /> 添加卖点
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <Input placeholder="卖点描述" {...register(`features.${index}.text`)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="删除卖点"
                onClick={() => features.remove(index)}
              >
                <Trash2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 产品图片管理 */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">产品图片</CardTitle>
          <span className="text-xs text-slate-400">第一张为主图（最多 4 张）</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div
                key={url}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`产品图 ${index + 1}`} className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="bg-brand-blue absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-white">
                    主图
                  </span>
                )}
                <button
                  type="button"
                  aria-label="删除图片"
                  onClick={() =>
                    void deleteAsset(url, () => setImages((prev) => prev.filter((u) => u !== url)))
                  }
                  className="absolute right-1.5 top-1.5 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <label className="hover:border-brand-blue flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 p-4 text-center transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  disabled={uploading !== null}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadAsset("image", file);
                    e.target.value = "";
                  }}
                />
                <Plus className="h-6 w-6 text-slate-400" />
                <span className="text-xs text-slate-500">
                  {uploading === "image" ? "上传中…" : "添加图片"}
                </span>
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 规格书 / 3D 模型 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">规格书与 3D 模型</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {(
            [
              {
                kind: "spec",
                icon: FileText,
                text: "点击上传规格书 PDF（≤100MB）",
                accept: "application/pdf",
                value: spec,
                clear: () => setSpec(""),
              },
              {
                kind: "model3d",
                icon: Package,
                text: "点击上传 3D 模型 .glb/.gltf（≤50MB）",
                accept: ".glb,.gltf",
                value: model3d,
                clear: () => setModel3d(""),
              },
            ] as const
          ).map((slot) =>
            slot.value ? (
              <div
                key={slot.kind}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"
              >
                <slot.icon className="text-brand-blue h-6 w-6 shrink-0" />
                <span className="min-w-0 flex-1 truncate text-xs text-slate-600">
                  {fileNameOf(slot.value)}
                </span>
                <button
                  type="button"
                  aria-label="删除文件"
                  onClick={() => void deleteAsset(slot.value, slot.clear)}
                  className="rounded-md p-1 text-slate-400 transition-colors hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                key={slot.kind}
                className="hover:border-brand-blue flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 p-4 text-center transition-colors"
              >
                <input
                  type="file"
                  className="hidden"
                  accept={slot.accept}
                  disabled={uploading !== null}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadAsset(slot.kind, file);
                    e.target.value = "";
                  }}
                />
                <slot.icon className="h-6 w-6 text-slate-400" />
                <span className="text-xs text-slate-500">
                  {uploading === slot.kind ? "上传中…" : slot.text}
                </span>
              </label>
            ),
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          {isSubmitting ? "保存中…" : "保存"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/products")}>
          取消
        </Button>
      </div>
    </form>
  );
}
