import { setRequestLocale } from "next-intl/server";
import { AuthPageCard } from "@/components/auth/AuthPageCard";

/** 登录页 */
export default function LoginPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return (
    <section className="bg-slate-50">
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-16 md:px-8 md:py-24 lg:px-12">
        <AuthPageCard mode="login" />
      </div>
    </section>
  );
}
