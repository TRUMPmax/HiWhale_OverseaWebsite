/** 公司介绍设置值（site_settings: company-about） */
export type CompanyAbout = {
  mission?: string;
  missionEn?: string;
  positioning?: {
    title?: string;
    titleEn?: string;
    text?: string;
    textEn?: string;
    text2?: string;
    text2En?: string;
  };
  milestones?: Array<{ year: string; event: string; eventEn?: string }>;
  rd?: {
    text?: string;
    textEn?: string;
    engineers?: string;
    patents?: string;
    countries?: string;
  };
  locations?: Array<{ city: string; cityEn?: string }>;
  certifications?: string[];
};

/** 首页数据指标设置值（site_settings: company-stats） */
export type CompanyStatItem = {
  value: string;
  label: string;
  labelEn?: string;
};

/** 联系方式设置值（site_settings: contact-info） */
export type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  addressEn?: string;
  whatsapp?: string;
  linkedin?: string;
};

/** 按语言取值：优先 en 字段，其次 zh 字段，最后 fallback */
export function pickLang(
  locale: string,
  zh: string | undefined,
  en: string | undefined,
  fallback: string,
): string {
  if (locale === "zh") return zh || en || fallback;
  return en || zh || fallback;
}

/** 解析 "500+" / "99.9%" / "50M+" → CountUp 参数 */
export function parseCountValue(value: string): { end: number; suffix: string; decimals: number } {
  const m = value.match(/^([\d.]+)(.*)$/);
  if (!m) return { end: 0, suffix: value, decimals: 0 };
  const num = parseFloat(m[1]);
  return { end: num, suffix: m[2] ?? "", decimals: m[1].includes(".") ? 1 : 0 };
}
