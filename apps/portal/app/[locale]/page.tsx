import { APP_NAME } from "@hiwhale/shared/constants";
import { useTranslations } from "next-intl";
import { Placeholder } from "@/components/ui/Placeholder";

/** 首页占位 */
export default function HomePage() {
  const t = useTranslations("metadata");
  const th = useTranslations("home");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-24">
      <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">{APP_NAME}</h1>
      <p className="mt-4 text-lg text-muted">{t("description")}</p>
      <div className="mt-12 w-full max-w-md">
        <Placeholder
          label={th("hero.placeholder.label")}
          format={th("hero.placeholder.format")}
          size={th("hero.placeholder.size")}
          description={th("hero.placeholder.description")}
        />
      </div>
    </div>
  );
}
