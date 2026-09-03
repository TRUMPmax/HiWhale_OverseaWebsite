import { ProductForm } from "@/components/products/ProductForm";

/** 新增产品 */
export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h2 className="text-xl font-bold text-slate-900">新增产品</h2>
      <ProductForm />
    </div>
  );
}
