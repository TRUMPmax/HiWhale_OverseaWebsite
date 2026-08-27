"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { API_BASE, apiPost } from "@/lib/api";
import { STATIC_TAXONOMY, taxonomyLabel, type TaxonomyGroup } from "@/lib/taxonomy";
import { Link } from "@/navigation";

const inputClass =
  "border-border focus:border-brand-blue w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors";
const errorClass = "mt-1 text-xs text-red-600";

/** 询盘表单（真实 API：POST /api/inquiries；意向品类跟随 DB 分类体系，API 失败回退静态常量） */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [taxonomy, setTaxonomy] = useState<TaxonomyGroup[]>(STATIC_TAXONOMY);

  // 意向品类：优先 DB 分类体系（后台新增分组实时可见），失败回退静态常量
  useEffect(() => {
    fetch(`${API_BASE}/api/taxonomy`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: TaxonomyGroup[]) => {
        if (Array.isArray(data) && data.length > 0) setTaxonomy(data);
      })
      .catch(() => {});
  }, []);

  const schema = z.object({
    name: z.string().min(1, t("errors.required")),
    company: z.string().min(1, t("errors.required")),
    email: z.string().email(t("errors.emailInvalid")),
    phone: z.string().optional(),
    country: z.string().min(1, t("errors.countryRequired")),
    interests: z.array(z.string()),
    description: z.string().min(20, t("errors.descriptionMin")),
    privacy: z.boolean().refine((v) => v, t("errors.privacyRequired")),
  });
  type ContactValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: { interests: [] },
  });

  const countries = t.raw("countries") as string[];

  const onSubmit = async (values: ContactValues) => {
    setFormError("");
    // 意向产品：所选大类展开为其下全部品类（按当前分类体系）
    const categories = (values.interests ?? []).flatMap(
      (g) => taxonomy.find((entry) => entry.key === g)?.categories.map((c) => c.key) ?? [],
    );
    try {
      await apiPost("/api/inquiries", {
        fullName: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone || undefined,
        country: values.country,
        categories,
        description: values.description,
      });
      setSubmitted(true);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : t("errors.submitFailed"));
    }
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
        <h3 className="font-heading text-foreground mt-4 text-xl font-bold">{t("successTitle")}</h3>
        <p className="text-muted mt-2 max-w-sm text-sm leading-relaxed">{t("successText")}</p>
        <button
          type="button"
          onClick={() => {
            reset();
            setSubmitted(false);
          }}
          className="text-brand-blue border-brand-blue mt-6 rounded-lg border bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-blue-50"
        >
          {t("submitAnother")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-slate-200 bg-white p-6 md:p-8"
      noValidate
    >
      <h2 className="font-heading text-foreground text-xl font-bold">{t("title")}</h2>
      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">{t("name")}</label>
            <input
              type="text"
              placeholder={t("namePlaceholder")}
              className={inputClass}
              {...register("name")}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">{t("company")}</label>
            <input
              type="text"
              placeholder={t("companyPlaceholder")}
              className={inputClass}
              {...register("company")}
            />
            {errors.company && <p className={errorClass}>{errors.company.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">{t("email")}</label>
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              className={inputClass}
              {...register("email")}
            />
            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-foreground mb-1 block text-sm font-medium">{t("phone")}</label>
            <input
              type="tel"
              placeholder={t("phonePlaceholder")}
              className={inputClass}
              {...register("phone")}
            />
          </div>
        </div>

        <div>
          <label className="text-foreground mb-1 block text-sm font-medium">{t("country")}</label>
          <select className={inputClass} {...register("country")} defaultValue="">
            <option value="" disabled>
              {t("countryPlaceholder")}
            </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && <p className={errorClass}>{errors.country.message}</p>}
        </div>

        <fieldset>
          <legend className="text-foreground mb-1 text-sm font-medium">{t("interest")}</legend>
          <div className="flex flex-wrap gap-3">
            {taxonomy.map(({ key }) => (
              <label
                key={key}
                className="text-muted flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <input type="checkbox" value={key} {...register("interests")} />
                {taxonomyLabel(taxonomy, key, locale) ?? key}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="text-foreground mb-1 block text-sm font-medium">
            {t("description")}
          </label>
          <textarea
            rows={4}
            placeholder={t("descriptionPlaceholder")}
            className={inputClass}
            {...register("description")}
          />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div>
          <label className="text-muted flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" {...register("privacy")} />
            <span>
              {t("privacy")}
              <Link href="/privacy-policy" className="text-brand-blue hover:underline">
                {t("privacyLink")}
              </Link>
            </span>
          </label>
          {errors.privacy && <p className={errorClass}>{errors.privacy.message}</p>}
        </div>

        {formError && <p className="text-xs text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-brand-blue w-full rounded-lg py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
      </div>
    </form>
  );
}
