"use client";

import { notFound } from "next/navigation";
import { getProductBySlug } from "@hiwhale/shared/constants";
import { ProductForm } from "@/components/products/ProductForm";
import { useProductsStore } from "@/store/products";

/** 编辑产品：store 记录 + Mock 详情预填 */
export default function EditProductPage({ params }: { params: { id: string } }) {
  const record = useProductsStore((s) => s.products.find((p) => p.id === params.id));

  if (!record) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-xl font-bold text-slate-900">编辑产品：{record.name}</h2>
      <ProductForm initial={{ record, mock: getProductBySlug(record.slug) }} />
    </div>
  );
}
