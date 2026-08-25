import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, MessageCircle, Phone, Share2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SlottedImage } from "@/components/ui/SlottedImage";
import { ContactForm } from "@/components/contact/ContactForm";
import type { ContactInfo } from "@/components/about/types";
import { fetchSetting } from "@/lib/settings";

/** 联系我们页：联系信息（优先公司数据中台）+ 询盘表单 */
export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const contact = await fetchSetting<ContactInfo>("contact-info");

  const infoRows = [
    { icon: Mail, label: t("info.email"), value: contact?.email ?? t("info.emailValue") },
    { icon: Phone, label: t("info.phone"), value: contact?.phone ?? t("info.phoneValue") },
    {
      icon: MapPin,
      label: t("info.address"),
      value:
        locale === "zh"
          ? (contact?.address ?? t("info.addressValue"))
          : (contact?.addressEn ?? contact?.address ?? t("info.addressValue")),
    },
    {
      icon: MessageCircle,
      label: t("info.whatsapp"),
      value: contact?.whatsapp ?? t("info.whatsappValue"),
    },
    {
      icon: Share2,
      label: t("info.linkedin"),
      value: contact?.linkedin ?? t("info.linkedinValue"),
    },
  ];

  return (
    <>
      <section className="bg-brand-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24 lg:px-12">
          <h1 className="font-heading text-3xl font-bold md:text-5xl">{t("banner.title")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">{t("banner.subtitle")}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-2 lg:px-12">
          <Reveal>
            <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
              <h2 className="font-heading text-foreground text-xl font-bold">{t("info.title")}</h2>
              <div className="mt-6 space-y-4">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <row.icon className="text-brand-blue mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <div className="text-subtle text-xs">{row.label}</div>
                      <div className="text-foreground text-sm font-medium">{row.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <SlottedImage
              src="/images/contact/contact-map.png"
              alt="公司位置地图截图"
              className="mt-6 aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
              placeholder={{
                ratio: "aspect-[4/3]",
                className: "mt-6",
                label: "公司位置地图截图",
                size: "4:3 · 建议 1200×900",
                name: "contact-map.png",
              }}
            />
          </Reveal>

          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
