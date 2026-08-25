/**
 * 站点素材位注册表：门户组件实际引用的展示位（public/images/<subdir>/<filename>）
 * area: 分组展示用；purpose: 用途描述（管理端展示）
 */
export type AssetSlot = {
  id: string;
  filename: string;
  subdir: string;
  area: string;
  purpose: string;
};

/** 由 DB 实体动态生成素材位：方案场景图 + 案例现场图/客户 Logo（文件名与 DB imageName/logoName 对齐） */
export function buildDynamicSlots(
  solutions: Array<{ slug: string; title: unknown; imageName: string }>,
  cases: Array<{
    slug: string;
    clientName: unknown;
    imageName: string;
    logoName: string;
  }>,
): AssetSlot[] {
  const zh = (v: unknown) =>
    v && typeof v === "object" ? String((v as { zh?: string }).zh ?? "") : "";
  return [
    ...solutions.map((s) => ({
      id: `solution-${s.slug}`,
      filename: s.imageName,
      subdir: "solutions",
      area: "方案",
      purpose: `方案场景图：${zh(s.title) || s.slug}`,
    })),
    ...cases.flatMap((c) => [
      {
        id: `case-${c.slug}`,
        filename: c.imageName,
        subdir: "cases",
        area: "案例",
        purpose: `案例现场图：${zh(c.clientName) || c.slug}`,
      },
      {
        id: `case-logo-${c.slug}`,
        filename: c.logoName,
        subdir: "cases",
        area: "案例",
        purpose: `案例客户 Logo：${zh(c.clientName) || c.slug}`,
      },
    ]),
  ];
}

export const ASSET_SLOTS: AssetSlot[] = [
  // 首页
  {
    id: "home-hero",
    filename: "home-hero-product-family.png",
    subdir: "home",
    area: "首页",
    purpose: "首页主视觉：全品类产品家族合影",
  },
  {
    id: "home-layer-equipment",
    filename: "home-layer-equipment.png",
    subdir: "home",
    area: "首页",
    purpose: "首页三层体系 · 设备层示意图",
  },
  {
    id: "home-layer-system",
    filename: "home-layer-system.png",
    subdir: "home",
    area: "首页",
    purpose: "首页三层体系 · 系统层示意图",
  },
  {
    id: "home-layer-solution",
    filename: "home-layer-solution.png",
    subdir: "home",
    area: "首页",
    purpose: "首页三层体系 · 方案层示意图",
  },
  {
    id: "home-brand-video",
    filename: "home-brand-video.mp4",
    subdir: "home",
    area: "首页",
    purpose: "首页企业宣传视频",
  },
  {
    id: "home-model-agv",
    filename: "model-agv-mbv15r.glb",
    subdir: "home",
    area: "首页",
    purpose: "首页 3D 模型查看器（AGV 示例模型）",
  },

  // 产品分组（首页生态卡片 + HeroNarrative 芯片）
  {
    id: "group-forklift",
    filename: "product-group-forklift.png",
    subdir: "products",
    area: "产品分组",
    purpose: "产品分组图：叉车产品",
  },
  {
    id: "group-mobile-robot",
    filename: "product-group-mobile-robot.png",
    subdir: "products",
    area: "产品分组",
    purpose: "产品分组图：移动机器人",
  },
  {
    id: "group-robotic-arm",
    filename: "product-group-robotic-arm.png",
    subdir: "products",
    area: "产品分组",
    purpose: "产品分组图：机械臂",
  },
  {
    id: "group-gantry-crane",
    filename: "product-group-gantry-crane.png",
    subdir: "products",
    area: "产品分组",
    purpose: "产品分组图：龙门吊",
  },
  {
    id: "group-cleaning-robot",
    filename: "product-group-cleaning-robot.png",
    subdir: "products",
    area: "产品分组",
    purpose: "产品分组图：清洁机器人",
  },
  {
    id: "group-delivery-robot",
    filename: "product-group-delivery-robot.png",
    subdir: "products",
    area: "产品分组",
    purpose: "产品分组图：配送机器人",
  },
  {
    id: "group-software",
    filename: "product-group-software.png",
    subdir: "products",
    area: "产品分组",
    purpose: "产品分组图：软件系统",
  },

  // 行业场景
  {
    id: "industry-ecommerce",
    filename: "industry-ecommerce.png",
    subdir: "industries",
    area: "行业",
    purpose: "行业场景图：电商",
  },
  {
    id: "industry-automotive",
    filename: "industry-automotive.png",
    subdir: "industries",
    area: "行业",
    purpose: "行业场景图：汽车",
  },
  {
    id: "industry-3pl",
    filename: "industry-3pl.png",
    subdir: "industries",
    area: "行业",
    purpose: "行业场景图：第三方物流",
  },
  {
    id: "industry-cold-chain",
    filename: "industry-cold-chain.png",
    subdir: "industries",
    area: "行业",
    purpose: "行业场景图：食品冷链",
  },
  {
    id: "industry-pharmaceutical",
    filename: "industry-pharmaceutical.png",
    subdir: "industries",
    area: "行业",
    purpose: "行业场景图：医药",
  },
  {
    id: "industry-port",
    filename: "industry-port.png",
    subdir: "industries",
    area: "行业",
    purpose: "行业场景图：港口",
  },

  // 客户 Logo 墙（首页 8 个占位）
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `client-logo-${i + 1}`,
    filename: `client-logo-${String(i + 1).padStart(2, "0")}.png`,
    subdir: "clients",
    area: "客户Logo",
    purpose: `首页客户 Logo 墙 #${i + 1}`,
  })),

  // 认证标志
  {
    id: "cert-ce",
    filename: "cert-ce.svg",
    subdir: "certs",
    area: "认证",
    purpose: "认证标志：CE",
  },
  {
    id: "cert-iso9001",
    filename: "cert-iso9001.svg",
    subdir: "certs",
    area: "认证",
    purpose: "认证标志：ISO 9001",
  },
  {
    id: "cert-iso3691-4",
    filename: "cert-iso3691-4.svg",
    subdir: "certs",
    area: "认证",
    purpose: "认证标志：ISO 3691-4",
  },
  {
    id: "cert-iso13849",
    filename: "cert-iso13849.svg",
    subdir: "certs",
    area: "认证",
    purpose: "认证标志：ISO 13849",
  },
  {
    id: "cert-ul",
    filename: "cert-ul.svg",
    subdir: "certs",
    area: "认证",
    purpose: "认证标志：UL",
  },

  // 关于我们
  {
    id: "about-team",
    filename: "about-team.png",
    subdir: "about",
    area: "关于我们",
    purpose: "关于我们：公司团队/办公场景图",
  },
  {
    id: "about-world-map",
    filename: "about-world-map.png",
    subdir: "about",
    area: "关于我们",
    purpose: "关于我们：全球布局世界地图",
  },
  {
    id: "about-factory",
    filename: "about-factory.png",
    subdir: "about",
    area: "关于我们",
    purpose: "关于我们：研发中心/工厂实拍图",
  },
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `partner-logo-${i + 1}`,
    filename: `partner-logo-0${i + 1}.png`,
    subdir: "about",
    area: "关于我们",
    purpose: `关于我们：合作伙伴 Logo #${i + 1}`,
  })),

  // 联系我们
  {
    id: "contact-map",
    filename: "contact-map.png",
    subdir: "contact",
    area: "其他",
    purpose: "联系我们：公司位置地图截图",
  },
];
