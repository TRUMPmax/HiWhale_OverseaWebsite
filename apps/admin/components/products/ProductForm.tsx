"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, GripVertical, Package, Plus, Trash2, X } from "lucide-react";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { getGroupOfCategory, INDUSTRY_LABELS } from "@hiwhale/shared/constants";
import type { ProductCategory } from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPicker } from "@/components/ui/IconPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resolveAssetUrl } from "@/lib/asset-url";
import { useProductsStore, type AdminProduct, type ProductPayload } from "@/store/products";
import { LangPair } from "./LangPair";
import { ProductPreview } from "./ProductPreview";
import { SpecGroupsEditor, type SpecGroupDraft } from "./SpecGroupsEditor";
import { fetchAdminTaxonomy, STATIC_ADMIN_TAXONOMY, type TaxonomyGroup } from "@/lib/taxonomy";
import { useAdminAuthStore } from "@/store/auth";

const schema = z.object({
  nameZh: z.string().min(1, "请输入中文名称"),
  nameEn: z.string().min(1, "请输入英文名称"),
  model: z.string().min(1, "请输入型号"),
  category: z.string().min(1, "请选择品类"),
  status: z.boolean(),
  quickSpecs: z.array(
    z.object({
      labelZh: z.string(),
      labelEn: z.string(),
      valueZh: z.string(),
      valueEn: z.string(),
    }),
  ),
  features: z.array(z.object({ zh: z.string(), en: z.string(), icon: z.string().optional() })),
});
type FormValues = z.infer<typeof schema>;

type ProductFormProps = {
  /** 编辑模式传入（store 记录，含完整字段） */
  initial?: { record: AdminProduct };
};

/** 可拖拽图片块（整块可拖；X 删除按钮通过 5px 激活距离与 stopPropagation 保持可点） */
function SortableImageTile({
  url,
  index,
  onDelete,
}: {
  url: string;
  index: number;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: url,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`group relative aspect-[4/3] cursor-grab overflow-hidden rounded-lg border border-slate-200 active:cursor-grabbing ${
        isDragging ? "z-10 opacity-80 shadow-lg" : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveAssetUrl(url)}
        alt={`产品图 ${index + 1}`}
        className="h-full w-full object-cover"
      />
      {index === 0 && (
        <span className="bg-brand-blue absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-white">
          主图
        </span>
      )}
      <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical className="h-3.5 w-3.5" />
      </span>
      <button
        type="button"
        aria-label="删除图片"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onDelete}
        className="absolute right-1.5 top-1.5 rounded-md bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

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
  /** 适用行业（多选） */
  const [scenarios, setScenarios] = useState<string[]>(initial?.record.scenarios ?? []);
  const [uploading, setUploading] = useState<"image" | "spec" | "model3d" | null>(null);
  /** 分类体系：优先 API（DB 实体），失败回退静态常量 */
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>(STATIC_ADMIN_TAXONOMY);
  useEffect(() => {
    void fetchAdminTaxonomy()
      .then(setTaxonomy)
      .catch(() => {});
  }, []);

  /** 拖拽传感器：5px 激活距离（避免误触删除按钮与普通点击） */
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  /** 拖拽结束：按目标位置重排（主图始终为 position 0） */
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setImages((prev) => {
      const oldIndex = prev.indexOf(String(active.id));
      const newIndex = prev.indexOf(String(over.id));
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

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

  /** 待删除素材 URL 列表（UI 中移除后暂存，保存成功后才真正删除 MinIO 对象） */
  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);

  /** 从 URL 提取 MinIO object key */
  const keyOf = (url: string) => url.split("hiwhale-uploads/")[1];

  /** UI 移除：仅从表单状态移除并记入待删除列表（保存后才生效） */
  const markForDeletion = (url: string, apply: () => void) => {
    setPendingDeletions((prev) => (prev.includes(url) ? prev : [...prev, url]));
    apply();
  };

  /** 保存成功后：尽力删除待删 MinIO 对象（忽略 404/失败） */
  const flushPendingDeletions = async () => {
    if (pendingDeletions.length === 0) return;
    const token = useAdminAuthStore.getState().token;
    await Promise.allSettled(
      pendingDeletions.map((url) =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/uploads`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ key: keyOf(url) }),
        }),
      ),
    );
    setPendingDeletions([]);
  };

  /** 从 URL 提取文件名 */
  const fileNameOf = (url: string) => url.split("/").pop() ?? url;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          nameZh: initial.record.name.zh,
          nameEn: initial.record.name.en,
          model: initial.record.model,
          category: initial.record.category,
          status: initial.record.status === "on",
          quickSpecs: initial.record.quickSpecs.map((s) => ({
            labelZh: s.label.zh,
            labelEn: s.label.en,
            valueZh: s.value.zh,
            valueEn: s.value.en,
          })),
          features: initial.record.features.map((f) =>
            "text" in f ? { zh: f.text.zh, en: f.text.en, icon: f.icon } : { zh: f.zh, en: f.en },
          ),
        }
      : {
          nameZh: "",
          nameEn: "",
          model: "",
          category: "",
          status: true,
          quickSpecs: [{ labelZh: "", labelEn: "", valueZh: "", valueEn: "" }],
          features: [{ zh: "", en: "" }],
        },
  });

  const specs = useFieldArray({ control, name: "quickSpecs" });
  const features = useFieldArray({ control, name: "features" });

  /** 卖点/描述（受控双语字段） */
  const [tagline, setTagline] = useState({
    zh: initial?.record.tagline.zh ?? "",
    en: initial?.record.tagline.en ?? "",
  });
  const [description, setDescription] = useState({
    zh: initial?.record.description.zh ?? "",
    en: initial?.record.description.en ?? "",
  });
  /** 详细参数表（受控编辑器） */
  const [specGroups, setSpecGroups] = useState<SpecGroupDraft[]>(
    initial?.record.specGroups.map((g) => ({
      groupZh: g.group.zh,
      groupEn: g.group.en,
      items: g.items.map((i) => ({
        labelZh: i.label.zh,
        labelEn: i.label.en,
        valueZh: i.value.zh,
        valueEn: i.value.en,
      })),
    })) ?? [],
  );

  const onSubmit = async (values: FormValues) => {
    const category = values.category as ProductCategory;

    // 英文字段缺失统计（允许保存，缺失处以中文回退填充）
    let missingEn = 0;
    const enOf = (zh: string, en: string) => {
      if (!en.trim()) missingEn++;
      return en.trim() || zh;
    };

    const payload: ProductPayload = {
      slug: initial?.record.slug ?? `custom-${Date.now()}`,
      model: values.model,
      category,
      group: getGroupOfCategory(category),
      name: { zh: values.nameZh, en: enOf(values.nameZh, values.nameEn) },
      tagline: { zh: tagline.zh, en: enOf(tagline.zh, tagline.en) },
      description: { zh: description.zh, en: enOf(description.zh, description.en) },
      quickSpecs: values.quickSpecs
        .filter((r) => r.labelZh.trim() && r.valueZh.trim())
        .map((r) => ({
          label: { zh: r.labelZh, en: enOf(r.labelZh, r.labelEn) },
          value: { zh: r.valueZh, en: enOf(r.valueZh, r.valueEn) },
        })),
      specGroups: specGroups
        .filter((g) => g.groupZh.trim())
        .map((g) => ({
          group: { zh: g.groupZh, en: enOf(g.groupZh, g.groupEn) },
          items: g.items
            .filter((i) => i.labelZh.trim() && i.valueZh.trim())
            .map((i) => ({
              label: { zh: i.labelZh, en: enOf(i.labelZh, i.labelEn) },
              value: { zh: i.valueZh, en: enOf(i.valueZh, i.valueEn) },
            })),
        })),
      features: values.features
        .filter((f) => f.zh.trim())
        .map((f) => ({
          text: { zh: f.zh, en: enOf(f.zh, f.en) },
          ...(f.icon ? { icon: f.icon } : {}),
        })),
      scenarios,
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
      if (missingEn > 0) {
        toast.warning(`有 ${missingEn} 个英文字段为空，已按中文回退填充（建议补全翻译）`);
      }
      // 保存成功后才删除 MinIO 对象（避免未保存时数据库指向已删除文件）
      await flushPendingDeletions();
      toast.success("保存成功");
      router.push("/products");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "保存失败");
    }
  };

  /** 实时预览数据：RHF 字段用 watch() 全量取值，非 RHF 字段用组件 state */
  const watched = watch();
  const previewData = {
    nameZh: watched.nameZh,
    nameEn: watched.nameEn,
    model: watched.model,
    category: watched.category,
    tagline,
    description,
    quickSpecs: watched.quickSpecs,
    features: watched.features,
    images: images.map((u) => resolveAssetUrl(u) ?? u),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-5 gap-8">
      <div className="col-span-3 space-y-6">
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
                {taxonomy.map((group) => (
                  <optgroup key={group.key} label={group.nameJson.zh}>
                    {group.categories.map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.nameJson.zh}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>适用行业（可多选）</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(INDUSTRY_LABELS).map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      scenarios.includes(key)
                        ? "border-brand-blue text-brand-blue bg-blue-50"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-brand-blue h-3.5 w-3.5"
                      checked={scenarios.includes(key)}
                      onChange={() =>
                        setScenarios((prev) =>
                          prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
                        )
                      }
                    />
                    {label.zh}
                  </label>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <LangPair
                label="一句话卖点"
                textarea
                zhValue={tagline.zh}
                enValue={tagline.en}
                onZhChange={(v) => setTagline((t) => ({ ...t, zh: v }))}
                onEnChange={(v) => setTagline((t) => ({ ...t, en: v }))}
              />
            </div>
            <div className="col-span-2">
              <LangPair
                label="描述"
                textarea
                rows={3}
                zhValue={description.zh}
                enValue={description.en}
                onZhChange={(v) => setDescription((d) => ({ ...d, zh: v }))}
                onEnChange={(v) => setDescription((d) => ({ ...d, en: v }))}
              />
            </div>
            <label className="col-span-2 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="accent-brand-blue h-4 w-4"
                {...register("status")}
              />
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
              onClick={() => specs.append({ labelZh: "", labelEn: "", valueZh: "", valueEn: "" })}
            >
              <Plus /> 添加参数
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {specs.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3">
                <div className="grid flex-1 grid-cols-2 gap-3">
                  <Input
                    placeholder="参数名（中文），如：额定载重"
                    {...register(`quickSpecs.${index}.labelZh`)}
                  />
                  <Input
                    placeholder="Label (EN), e.g. Load Capacity"
                    {...register(`quickSpecs.${index}.labelEn`)}
                  />
                  <Input
                    placeholder="参数值（中文），如：1,500 kg"
                    {...register(`quickSpecs.${index}.valueZh`)}
                  />
                  <Input
                    placeholder="Value (EN), e.g. 1,500 kg"
                    {...register(`quickSpecs.${index}.valueEn`)}
                  />
                </div>
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
              onClick={() => features.append({ zh: "", en: "" })}
            >
              <Plus /> 添加卖点
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {features.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-3">
                <Input placeholder="卖点描述（中文）" {...register(`features.${index}.zh`)} />
                <Input placeholder="Feature (EN)" {...register(`features.${index}.en`)} />
                <IconPicker
                  value={watch(`features.${index}.icon`)}
                  onChange={(name) => setValue(`features.${index}.icon`, name)}
                />
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

        {/* 详细参数表（中英双语） */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">详细参数表</CardTitle>
          </CardHeader>
          <CardContent>
            <SpecGroupsEditor groups={specGroups} onChange={setSpecGroups} />
          </CardContent>
        </Card>

        {/* 产品图片管理（拖拽排序，第一张为主图） */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">产品图片</CardTitle>
            <span className="text-xs text-slate-400">
              拖拽调整顺序，第一张为主图（最多 4 张）· 删除图片在保存后生效
            </span>
          </CardHeader>
          <CardContent>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={images} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <SortableImageTile
                      key={url}
                      url={url}
                      index={index}
                      onDelete={() =>
                        markForDeletion(url, () =>
                          setImages((prev) => prev.filter((u) => u !== url)),
                        )
                      }
                    />
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
              </SortableContext>
            </DndContext>
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
                    onClick={() => markForDeletion(slot.value, slot.clear)}
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
      </div>
      <div className="col-span-2">
        <div className="sticky top-6 rounded-lg bg-slate-50 p-4">
          <ProductPreview data={previewData} />
        </div>
      </div>
    </form>
  );
}
