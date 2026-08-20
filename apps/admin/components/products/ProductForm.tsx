"use client";

import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Package, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  getLocalizedLabel,
  PRODUCT_CATEGORY_GROUPS,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_GROUP_LABELS,
} from "@hiwhale/shared/constants";
import type { MockProduct } from "@hiwhale/shared/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProductsStore, type AdminProduct } from "@/store/products";

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
  /** 编辑模式传入（store 记录 + Mock 详情） */
  initial?: { record: AdminProduct; mock?: MockProduct };
};

const UPLOAD_SLOTS = [
  { key: "image", icon: Upload, text: "点击或拖拽上传产品图片（占位，后端就绪后接 MinIO）" },
  { key: "spec", icon: FileText, text: "点击或拖拽上传规格书 PDF（占位，后端就绪后接 MinIO）" },
  {
    key: "model3d",
    icon: Package,
    text: "点击或拖拽上传 3D 模型 .glb（占位，后端就绪后接 MinIO）",
  },
];

/** 产品新增/编辑表单（Mock 提交 → zustand store） */
export function ProductForm({ initial }: ProductFormProps) {
  const router = useRouter();
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          nameZh: initial.record.name,
          nameEn: initial.mock?.name.en ?? initial.record.name,
          model: initial.record.model,
          category: initial.record.category,
          description: initial.record.description,
          status: initial.record.status === "on",
          quickSpecs:
            initial.mock?.quickSpecs.map((s) => ({ label: s.label.zh, value: s.value })) ?? [],
          features: initial.mock?.features.map((f) => ({ text: f.zh })) ?? [],
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

  const onSubmit = (values: FormValues) => {
    const patch = {
      name: values.nameZh,
      model: values.model,
      category: values.category as AdminProduct["category"],
      description: values.description,
      status: (values.status ? "on" : "off") as AdminProduct["status"],
    };
    if (initial) {
      updateProduct(initial.record.id, patch);
    } else {
      const id = `p-${Date.now()}`;
      addProduct({
        id,
        slug: `custom-${id}`,
        createdAt: new Date().toISOString().slice(0, 10),
        ...patch,
      });
    }
    toast.success("保存成功");
    router.push("/products");
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">素材上传</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {UPLOAD_SLOTS.map((slot) => (
            <div
              key={slot.key}
              className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 p-4 text-center"
            >
              <slot.icon className="h-6 w-6 text-slate-400" />
              <span className="text-xs text-slate-500">{slot.text}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
          保存
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/products")}>
          取消
        </Button>
      </div>
    </form>
  );
}
