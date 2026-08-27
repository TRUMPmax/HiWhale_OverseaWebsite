"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { RotateCw } from "lucide-react";
import { Link } from "@/navigation";
import { Placeholder } from "@/components/ui/Placeholder";

const SPEC_KEYS = ["loadCapacity", "liftHeight", "navigation", "battery"] as const;

const MODEL_URL = "/images/home/model-agv-mbv15r.glb";
const MODEL_NAME = "model-agv-mbv15r.glb";

/** 3D 查看器体积大（three.js），仅在客户端按需加载 */
const ModelViewer = dynamic(
  () => import("./ModelViewer").then((m) => m.ModelViewer),
  {
    ssr: false,
    loading: () => (
      <Placeholder
        ratio="aspect-square"
        label="3D 模型加载中…"
        size="首次加载需下载模型文件"
        name={MODEL_NAME}
      />
    ),
  },
);

/** 首页分区 5：3D 产品预览（GLB 实机渲染；素材位 model-agv-mbv15r.glb） */
export function ProductViewer3D() {
  const t = useTranslations("home.viewer3d");
  const [resetKey, setResetKey] = useState(0);

  return (
    <section className="bg-white/75 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-foreground text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-muted mt-4 text-lg">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
          <div className="relative">
            <ModelViewer
              url={MODEL_URL}
              resetKey={resetKey}
              placeholder={{
                label: t("placeholder.label"),
                size: t("placeholder.size"),
                name: MODEL_NAME,
              }}
            />
            <button
              type="button"
              onClick={() => setResetKey((k) => k + 1)}
              className="border-border text-muted absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:border-blue-300 hover:text-brand-blue"
            >
              <RotateCw className="h-4 w-4" />
              {t("resetView")}
            </button>
          </div>

          <div>
            <div className="flex gap-2">
              <span className="bg-brand-blue rounded-lg px-4 py-2 text-sm font-medium text-white">
                MBV15R
              </span>
            </div>

            <h3 className="font-heading text-foreground mt-6 text-2xl font-bold">
              {t("productName")}
            </h3>
            <p className="text-muted mt-2">{t("productDescription")}</p>

            <dl className="mt-6 space-y-3">
              {SPEC_KEYS.map((key) => (
                <div
                  key={key}
                  className="border-border flex items-center justify-between border-b pb-3"
                >
                  <dt className="text-muted text-sm">{t(`specs.${key}.label`)}</dt>
                  <dd className="text-foreground text-sm font-medium">{t(`specs.${key}.value`)}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="text-brand-blue text-sm font-medium hover:underline"
              >
                {t("viewFullSpecs")} →
              </Link>
              <Link
                href="/contact"
                className="bg-brand-blue rounded-lg px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                {t("requestConsultation")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
