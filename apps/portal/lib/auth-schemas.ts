import { z } from "zod";

type Translate = (key: string) => string;

/** 登录表单 schema（错误消息走 i18n） */
export function createLoginSchema(t: Translate) {
  return z.object({
    email: z.string().email(t("errors.emailInvalid")),
    password: z.string().min(8, t("errors.passwordMin")),
  });
}
export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;

/** 注册表单 schema（错误消息走 i18n） */
export function createRegisterSchema(t: Translate) {
  return z
    .object({
      name: z.string().min(2, t("errors.nameRequired")),
      company: z.string().min(2, t("errors.companyRequired")),
      email: z.string().email(t("errors.emailInvalid")),
      code: z.string().regex(/^\d{6}$/, t("errors.codeInvalid")),
      password: z.string().min(8, t("errors.passwordMin")),
      confirmPassword: z.string(),
      terms: z.boolean().refine((v) => v, t("errors.termsRequired")),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: t("errors.passwordMismatch"),
      path: ["confirmPassword"],
    });
}
export type RegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>;
