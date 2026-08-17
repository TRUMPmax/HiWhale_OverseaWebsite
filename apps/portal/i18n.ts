import { getRequestConfig } from "next-intl/server";
import { defaultLocale } from "./navigation";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const resolvedLocale = locale ?? (await requestLocale) ?? defaultLocale;

  return {
    locale: resolvedLocale,
    timeZone: "Asia/Shanghai",
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});
