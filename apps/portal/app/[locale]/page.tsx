import { Hero } from "@/components/home/Hero";
import { HeroNarrative } from "@/components/home/HeroNarrative";
import { ProductEcosystem } from "@/components/home/ProductEcosystem";
import { SolutionIntegration } from "@/components/home/SolutionIntegration";
import { IndustrySolutions } from "@/components/home/IndustrySolutions";
import { ProductViewer3D } from "@/components/home/ProductViewer3D";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { StatsAndClients } from "@/components/home/StatsAndClients";
import { Certifications } from "@/components/home/Certifications";
import { CTASection } from "@/components/home/CTASection";

/** 首页：滚轮叙事 Hero（桌面）/ 静态 Hero（移动）+ 8 个静态功能分区 */
export default function HomePage() {
  return (
    <>
      <HeroNarrative />
      <Hero />
      <ProductEcosystem />
      <SolutionIntegration />
      <IndustrySolutions />
      <ProductViewer3D />
      <VideoShowcase />
      <StatsAndClients />
      <Certifications />
      <CTASection />
    </>
  );
}
