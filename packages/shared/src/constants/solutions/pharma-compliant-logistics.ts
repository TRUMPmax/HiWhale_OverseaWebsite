import { AMR, IWMS, L, PHARMACEUTICAL, RGV, WCS } from "../products/helpers";
import type { MockSolution } from "./types";

export const pharmaCompliantLogistics: MockSolution = {
  slug: "pharma-compliant-logistics",
  industry: PHARMACEUTICAL,
  title: L("Pharmaceutical Compliant Logistics", "医药合规物流方案"),
  summary: L(
    "GMP-compliant automation with batch-level traceability from inbound to outbound.",
    "符合 GMP 的自动化，入库到出库批次级全程追溯。",
  ),
  description: L(
    "Pharmaceutical logistics leaves no room for error. This solution combines cleanroom-compatible AMRs, RGV shuttles and the HiWhale IWMS to deliver GMP-compliant warehousing: batch and expiry tracking, quarantine management, electronic audit trails and environmental monitoring — all validated and audit-ready.",
    "医药物流容不得差错。本方案以洁净环境兼容的 AMR、RGV 穿梭车与浩鲸 IWMS 构建符合 GMP 的仓储体系：批次与效期跟踪、待验品管理、电子审计追踪与环境监测，全部通过验证、随时迎接审计。",
  ),
  painPoints: [
    L(
      "GMP audits demand complete, tamper-proof batch records",
      "GMP 审计要求完整且不可篡改的批次记录",
    ),
    L(
      "Manual handling risks contamination in clean environments",
      "人工搬运在洁净环境中带来污染风险",
    ),
    L(
      "Expiry and quarantine management is error-prone on paper",
      "效期与待验管理依赖纸质流程易出错",
    ),
    L("Recalls require minute-level batch traceability", "药品召回要求分钟级批次追溯能力"),
  ],
  equipment: [AMR, RGV, IWMS, WCS],
  process: [
    {
      title: L("Compliance Gap Analysis", "合规差距分析"),
      description: L(
        "We review your SOPs against GMP requirements and define the validated system scope.",
        "对照 GMP 要求审查现有 SOP，界定待验证系统范围。",
      ),
    },
    {
      title: L("Validated System Design", "验证体系设计"),
      description: L(
        "IQ/OQ/PQ validation protocols are designed together with your quality team.",
        "与您的质量团队共同设计 IQ/OQ/PQ 验证方案。",
      ),
    },
    {
      title: L("Clean-zone Deployment", "洁净区部署"),
      description: L(
        "Cleanroom-compatible robots are deployed with particle and ESD controls.",
        "部署洁净环境兼容的机器人，落实微粒与静电控制。",
      ),
    },
    {
      title: L("Traceability Go-live", "追溯体系上线"),
      description: L(
        "Batch, expiry, quarantine and temperature data flow into one audit-ready record.",
        "批次、效期、待验与温湿度数据汇入同一套可审计记录。",
      ),
    },
    {
      title: L("Audit Support & Revalidation", "审计支持与再验证"),
      description: L(
        "We support regulatory audits and scheduled revalidation throughout the lifecycle.",
        "全生命周期内支持监管审计与周期性再验证。",
      ),
    },
  ],
  results: [
    { value: "100%", label: L("Batch Traceability", "批次追溯覆盖率") },
    { value: "0", label: L("Audit Critical Findings", "审计严重缺陷项") },
    { value: "-70%", label: L("Recall Response Time", "召回响应时间缩短") },
    { value: "-50%", label: L("Cleanroom Headcount", "洁净区人员减少") },
  ],
  imageName: "solution-pharma.png",
};
