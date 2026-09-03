import { Hero } from "@/components/home/Hero";
import { HeroNarrative } from "@/components/home/HeroNarrative";
import { Starfield } from "@/components/ui/Starfield";
import { ProductEcosystem } from "@/components/home/ProductEcosystem";
import { SolutionIntegration } from "@/components/home/SolutionIntegration";
import { IndustrySolutions } from "@/components/home/IndustrySolutions";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { StatsAndClients } from "@/components/home/StatsAndClients";
import { Certifications } from "@/components/home/Certifications";
import { CTASection } from "@/components/home/CTASection";
import { fetchTaxonomy } from "@/lib/taxonomy";
import { fetchSetting } from "@/lib/settings";
import type { CompanyStatItem } from "@/components/about/types";
import type { HomeIndustryCard } from "@/components/home/types";

/** 首页：滚轮叙事 Hero（桌面）/ 静态 Hero（移动）+ 8 个静态功能分区 */
export default async function HomePage() {
  const [taxonomy, companyStats, homeIndustries] = await Promise.all([
    fetchTaxonomy(),
    fetchSetting<CompanyStatItem[]>("company-stats"),
    fetchSetting<HomeIndustryCard[]>("home-industries"),
  ]);

  return (
    <>
      {/* 全局页底：夜空渐变 + 星空（fixed 铺底；Hero 自带同色渐变覆盖，功能板块用半透明面板浮于其上） */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #0A2540 0%, #061529 60%, #050D1F 100%)",
        }}
      >
        <Starfield className="h-full w-full" density={0.0006} yellowRatio={0.12} />
      </div>
      <HeroNarrative taxonomy={taxonomy} stats={companyStats} industryCards={homeIndustries} />
      <Hero />
      <ProductEcosystem taxonomy={taxonomy} />
      <SolutionIntegration />
      <IndustrySolutions cards={homeIndustries} />
      <VideoShowcase />
      <StatsAndClients stats={companyStats} />
      <Certifications />
      <CTASection />
    </>
  );
}
