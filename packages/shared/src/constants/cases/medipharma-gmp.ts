import { L, PHARMACEUTICAL } from "../products/helpers";
import type { MockCase } from "./types";

export const caseMediPharma: MockCase = {
  slug: "case-medipharma-gmp",
  clientName: L("MediPharma Distribution", "康泰医药流通"),
  industry: PHARMACEUTICAL,
  project: L(
    "GMP-Validated Automated Pharma Distribution Center",
    "通过 GMP 验证的自动化医药配送中心",
  ),
  background: L(
    "MediPharma distributes prescription drugs and vaccines to 6,000 pharmacies. Its new central DC had to pass GMP inspection while tripling throughput over its legacy paper-based site.",
    "康泰医药流通为 6,000 家药店配送处方药与疫苗。其新建中心仓必须在通过 GMP 检查的同时，将吞吐量提升至老仓的三倍。",
  ),
  challenge: L(
    "Every batch movement had to be traceable and tamper-proof, quarantine states strictly enforced, and the entire system validated under IQ/OQ/PQ protocols before a single box could ship.",
    "每一次批次移动都必须可追溯且不可篡改，待验状态严格管控，整套系统必须通过 IQ/OQ/PQ 验证后才允许发出第一箱货。",
  ),
  solution: L(
    "HiWhale delivered cleanroom-compatible AMRs and RGV shuttles with a validated IWMS: batch-level traceability, quarantine interlocks and electronic audit trails. Full IQ/OQ/PQ documentation was co-authored with the client's QA team.",
    "浩鲸交付了洁净环境兼容的 AMR 与 RGV 穿梭车，以及通过验证的 IWMS：批次级追溯、待验联锁与电子审计追踪。完整的 IQ/OQ/PQ 文档与客户质量团队共同编写。",
  ),
  equipment: [
    L("64 × Cleanroom-compatible MBH08L AMR", "64 台洁净型 MBH08L AMR"),
    L("6 × MBR04G Rail-Guided Shuttle", "6 台 MBR04G 有轨制导穿梭车"),
    L("HiWhale IWMS (GMP-validated)", "浩鲸 IWMS（通过 GMP 验证）"),
    L("Environmental monitoring integration", "环境监测系统集成"),
  ],
  productSlugs: ["mbh08l-latent-lifting-amr", "hiwhale-iwms"],
  duration: L("20 weeks", "20 周"),
  results: [
    { value: "100%", label: L("Batch Traceability", "批次追溯覆盖率") },
    { value: "0", label: L("GMP Critical Findings", "GMP 审计严重缺陷项") },
    { value: "3×", label: L("Throughput vs. Legacy Site", "吞吐量（对比老仓）") },
    { value: "-65%", label: L("Recall Response Time", "召回响应时间缩短") },
  ],
  testimonial: {
    quote: L(
      "The inspectors spent two days on our electronic batch records and found nothing to question. That is the highest compliment a pharma DC can get.",
      "检查员花了两天审查我们的电子批次记录，提不出任何问题。这是医药仓能获得的最高评价。",
    ),
    author: L("Chen Lijuan", "陈丽娟"),
    role: L("Quality Director, MediPharma", "康泰医药流通 质量总监"),
  },
  logoName: "case-logo-medipharma.png",
  imageName: "case-medipharma.png",
};
