import { AUTOMOTIVE, L } from "../products/helpers";
import type { MockCase } from "./types";

export const caseNordAuto: MockCase = {
  slug: "case-nordauto-line-side",
  clientName: L("NordAuto Manufacturing", "北欧汽车制造"),
  industry: AUTOMOTIVE,
  project: L("Just-in-Sequence Line-Side Delivery for EV Plant", "电动汽车工厂准时制线边配送"),
  background: L(
    "NordAuto's new EV plant in Gothenburg runs a 62-second takt across mixed-model production of four vehicle platforms. Line-side space was engineered to a minimum, leaving no room for error in parts delivery.",
    "北欧汽车位于哥德堡的新电动车工厂以 62 秒节拍混线生产四大平台车型。线边空间被压缩到极致，零部件配送不容任何差错。",
  ),
  challenge: L(
    "Mixed-model sequencing meant 3,000+ part numbers had to arrive at the right station in the right order. A single mis-sequenced trolley could stop the entire line at a cost of €22,000 per minute.",
    "混线排序生产意味着 3,000 多种零件必须按序送达正确工位。任何一辆错序料车都可能导致全线停产，每分钟损失 2.2 万欧元。",
  ),
  solution: L(
    "HiWhale deployed 46 MBA12T jacking AGVs on QR routes with WCS directly integrated to the plant MES. Andon-triggered pull loops and sequenced kitting zones guarantee just-in-sequence delivery with zero forklift traffic at the line.",
    "浩鲸部署 46 台 MBA12T 顶升式 AGV 沿二维码路径运行，WCS 与工厂 MES 直接集成。安灯触发的循环拉动与排序配料区保障了准时制排序配送，线边实现零叉车穿行。",
  ),
  equipment: [
    L("46 × MBA12T Latent Jacking AGV", "46 台 MBA12T 潜伏顶升式 AGV"),
    L("8 × MBV15R AGV Forklift for inbound docks", "8 台 MBV15R 无人叉车（入库月台）"),
    L("HiWhale WCS with MES integration", "浩鲸 WCS（对接 MES）"),
    L("Sequenced kitting zone automation", "排序配料区自动化"),
  ],
  duration: L("16 weeks", "16 周"),
  results: [
    { value: "99.97%", label: L("Sequencing Accuracy", "排序准确率") },
    { value: "0", label: L("Material-related Stoppages", "缺料停线次数") },
    { value: "-58%", label: L("Line-side Inventory", "线边库存下降") },
    { value: "-90%", label: L("Forklift Traffic at Line", "线边叉车流量下降") },
  ],
  testimonial: {
    quote: L(
      "The line has not stopped once for parts since go-live. Our takt is finally limited by engineering, not logistics.",
      "上线以来产线从未因缺料停过一秒。节拍终于只取决于工艺，不再受制于物流。",
    ),
    author: L("Erik Johansson", "Erik Johansson"),
    role: L("Plant Logistics Director, NordAuto", "北欧汽车 工厂物流总监"),
  },
  logoName: "case-logo-nordauto.png",
  imageName: "case-nordauto.png",
};
