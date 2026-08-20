"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const inputClass =
  "border-border focus:border-brand-blue w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors";
const errorClass = "mt-1 text-xs text-red-600";

type Tab = "login" | "register";

/** 登录表单（Mock：以邮箱前缀作为显示名直接登录） */
function LoginForm() {
  const t = useTranslations("auth");
  const login = useAuthStore((s) => s.login);

  const schema = z.object({
    email: z.string().email(t("errors.emailInvalid")),
    password: z.string().min(8, t("errors.passwordMin")),
  });
  type LoginValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: LoginValues) => {
    login({ name: values.email.split("@")[0] ?? values.email, email: values.email });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
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
        <label className="text-foreground mb-1 block text-sm font-medium">{t("password")}</label>
        <input
          type="password"
          placeholder={t("passwordPlaceholder")}
          className={inputClass}
          {...register("password")}
        />
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>
      <button
        type="submit"
        className="bg-brand-blue w-full rounded-lg py-2.5 font-medium text-white transition-opacity hover:opacity-90"
      >
        {t("submitLogin")}
      </button>
    </form>
  );
}

/** 注册表单（Mock：提交即登录） */
function RegisterForm() {
  const t = useTranslations("auth");
  const login = useAuthStore((s) => s.login);

  const schema = z
    .object({
      name: z.string().min(2, t("errors.nameRequired")),
      company: z.string().min(2, t("errors.companyRequired")),
      email: z.string().email(t("errors.emailInvalid")),
      password: z.string().min(8, t("errors.passwordMin")),
      confirmPassword: z.string(),
      terms: z.boolean().refine((v) => v, t("errors.termsRequired")),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t("errors.passwordMismatch"),
      path: ["confirmPassword"],
    });
  type RegisterValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: RegisterValues) => {
    login({ name: values.name, email: values.email });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
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
        <label className="text-foreground mb-1 block text-sm font-medium">{t("password")}</label>
        <input
          type="password"
          placeholder={t("passwordPlaceholder")}
          className={inputClass}
          {...register("password")}
        />
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>
      <div>
        <label className="text-foreground mb-1 block text-sm font-medium">
          {t("confirmPassword")}
        </label>
        <input
          type="password"
          placeholder={t("confirmPasswordPlaceholder")}
          className={inputClass}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
      </div>
      <div>
        <label className="text-muted flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" {...register("terms")} />
          {t("terms")}
        </label>
        {errors.terms && <p className={errorClass}>{errors.terms.message}</p>}
      </div>
      <button
        type="submit"
        className="bg-brand-blue w-full rounded-lg py-2.5 font-medium text-white transition-opacity hover:opacity-90"
      >
        {t("submitRegister")}
      </button>
    </form>
  );
}

/** 全局登录/注册弹窗（挂载于 [locale] layout） */
export function AuthModal() {
  const t = useTranslations("auth");
  const isOpen = useAuthStore((s) => s.isAuthModalOpen);
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);
  const [tab, setTab] = useState<Tab>("login");

  if (!isOpen) return null;

  const tabClass = (selected: boolean) =>
    `flex-1 border-b-2 py-3 text-sm font-medium transition-colors ${
      selected
        ? "border-brand-blue text-brand-blue"
        : "border-border text-muted hover:text-foreground"
    }`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label={t("close")}
          onClick={closeAuthModal}
          className="text-subtle hover:text-foreground absolute right-4 top-4"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-heading text-foreground text-xl font-bold">
          {tab === "login" ? t("loginTitle") : t("registerTitle")}
        </h2>

        <div className="mt-4 flex">
          <button
            type="button"
            className={tabClass(tab === "login")}
            onClick={() => setTab("login")}
          >
            {t("loginTab")}
          </button>
          <button
            type="button"
            className={tabClass(tab === "register")}
            onClick={() => setTab("register")}
          >
            {t("registerTab")}
          </button>
        </div>

        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
