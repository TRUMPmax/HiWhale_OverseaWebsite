"use client";

import { useEffect } from "react";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/products/ProductForm";
import { useProductsStore } from "@/store/products";

/** 编辑产品：store 记录预填（数据来自 API） */
export default function EditProductPage({ params }: { params: { id: string } }) {
  const record = useProductsStore((s) => s.products.find((p) => p.id === params.id));
  const loading = useProductsStore((s) => s.loading);
  const products = useProductsStore((s) => s.products);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);

  useEffect(() => {
    if (products.length === 0 && !loading) void fetchProducts();
  }, [products.length, loading, fetchProducts]);

  if (products.length === 0) return null; // 加载中
  if (!record) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-xl font-bold text-slate-900">编辑产品：{record.name.zh}</h2>
      <ProductForm initial={{ record }} />
    </div>
  );
}
