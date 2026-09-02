"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  createLoginSchema,
  createRegisterSchema,
  type LoginValues,
  type RegisterValues,
} from "@/lib/auth-schemas";
import { apiPost } from "@/lib/api";
import { useAuthStore, type AuthUser } from "@/store/auth";

const inputClass =
  "border-border focus:border-brand-blue w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors";
const errorClass = "mt-1 text-xs text-red-600";

type AuthFormProps = {
  /** 提交成功后的回调（登录页跳转 / 弹窗无需传，login 会自动关闭弹窗） */
  onSuccess?: () => void;
};

type AuthResponse = {
  user: AuthUser;
  token: string;
};

/** 登录表单（真实 API：POST /api/auth/login） */
export function LoginForm({ onSuccess }: AuthFormProps) {
  const t = useTranslations("auth");
  const login = useAuthStore((s) => s.login);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(createLoginSchema(t)) });

  const onSubmit = async (values: LoginValues) => {
    setFormError("");
    try {
      const res = await apiPost<AuthResponse>("/api/auth/login", values);
      login(res.user, res.token);
      onSuccess?.();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : t("errors.requestFailed"));
    }
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
      {formError && <p className={errorClass}>{formError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-blue w-full rounded-lg py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? t("submitting") : t("submitLogin")}
      </button>
    </form>
  );
}

/** 注册表单（真实 API：send-code 获取邮箱验证码 + register；无 SMTP 时演示模式回显验证码） */
export function RegisterForm({ onSuccess }: AuthFormProps) {
  const t = useTranslations("auth");
  const login = useAuthStore((s) => s.login);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(createRegisterSchema(t)) });

  // 重发倒计时
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  /** 发送验证码（真实 API；演示模式返回 devCode 直接展示） */
  const sendCode = async () => {
    const emailValid = await trigger("email");
    if (!emailValid) return;
    setSending(true);
    try {
      const res = await apiPost<{ sent: boolean; devCode?: string }>("/api/auth/send-code", {
        email: getValues("email"),
      });
      setSentCode(res.devCode ?? "sent");
      setCountdown(60);
      clearErrors("code");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : t("errors.requestFailed"));
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (values: RegisterValues) => {
    if (!sentCode) {
      setError("code", { message: t("errors.codeNotSent") });
      return;
    }
    setFormError("");
    try {
      const res = await apiPost<AuthResponse>("/api/auth/register", {
        name: values.name,
        company: values.company,
        email: values.email,
        code: values.code,
        password: values.password,
      });
      login(res.user, res.token);
      onSuccess?.();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : t("errors.requestFailed"));
    }
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
        <label className="text-foreground mb-1 block text-sm font-medium">{t("code")}</label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t("codePlaceholder")}
            className={inputClass}
            {...register("code")}
          />
          <button
            type="button"
            onClick={sendCode}
            disabled={countdown > 0 || sending}
            className="border-brand-blue text-brand-blue shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors hover:bg-blue-50 disabled:opacity-50"
          >
            {countdown > 0 ? t("resendIn", { s: countdown }) : sending ? "…" : t("sendCode")}
          </button>
        </div>
        {errors.code && <p className={errorClass}>{errors.code.message}</p>}
        {sentCode && sentCode !== "sent" && (
          <p className="text-muted mt-1 text-xs">{t("codeSentDemo", { code: sentCode })}</p>
        )}
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
      {formError && <p className={errorClass}>{formError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand-blue w-full rounded-lg py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? t("submitting") : t("submitRegister")}
      </button>
    </form>
  );
}
