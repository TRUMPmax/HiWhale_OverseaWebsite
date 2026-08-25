import { L, S, IWMS, E_COMMERCE, THIRD_PARTY_LOGISTICS, PHARMACEUTICAL } from "./helpers";
import type { MockProduct } from "./types";

export const hiwhaleIwms: MockProduct = {
  slug: "hiwhale-iwms",
  model: "MBW-IMS",
  category: IWMS,
  name: L("HiWhale IWMS Platform", "浩鲸仓储管理系统 IWMS"),
  tagline: L(
    "Inventory, orders and fulfillment orchestrated in one platform.",
    "库存、订单与履约，一个平台统一管理。",
  ),
  description: L(
    "HiWhale IWMS is an intelligent warehouse management system covering inbound, inventory, outbound and fulfillment. It orchestrates people, equipment and robots in real time, and connects seamlessly with HiWhale WCS to turn every order into optimized warehouse execution.",
    "浩鲸仓储管理系统 IWMS 覆盖入库、库存、出库与履约全链路，实时统筹人、设备与机器人协同作业，并与浩鲸 WCS 无缝衔接，将每一笔订单转化为最优的仓库执行。",
  ),
  quickSpecs: [
    S("Concurrent Devices", "并发设备数", "500+"),
    S("Deployment", "部署方式", "Cloud / On-premise"),
    S("API", "开放接口", "Open REST / GraphQL"),
    S("Languages", "界面语言", "EN / ZH"),
  ],
  specGroups: [
    {
      group: L("Platform", "平台能力"),
      items: [
        S(
          "Deployment",
          "部署方式",
          "SaaS 云部署 / 本地私有化部署",
          "SaaS cloud / on-premises private deployment",
        ),
        S("Concurrent Devices", "并发设备数", "500+"),
        S(
          "Multi-Warehouse",
          "多仓管理",
          "100+ 仓，集团化多组织",
          "100+ warehouses, multi-organization",
        ),
        S(
          "Languages",
          "界面语言",
          "EN / ZH（可扩展多语言）",
          "EN / ZH (extensible to more languages)",
        ),
      ],
    },
    {
      group: L("Integration", "系统集成"),
      items: [
        S("API", "开放接口", "Open REST / GraphQL / Webhook"),
        S(
          "Upstream",
          "上游对接",
          "ERP / OMS / TMS / 电商平台",
          "ERP / OMS / TMS / e-commerce platforms",
        ),
        S(
          "Downstream",
          "下游对接",
          "WCS / AGV / AS-RS / 输送分拣",
          "WCS / AGV / AS-RS / conveying & sorting",
        ),
        S(
          "Data Sync",
          "数据同步",
          "实时 WebSocket + 消息队列",
          "Real-time WebSocket + message queue",
        ),
      ],
    },
    {
      group: L("Security", "数据安全"),
      items: [
        S(
          "Access Control",
          "权限管理",
          "RBAC 角色权限 + 数据权限",
          "RBAC role-based access + data permissions",
        ),
        S("Encryption", "传输加密", "TLS 1.3"),
        S("Audit", "审计", "全量操作审计日志", "Full operation audit logs"),
        S("Compliance", "合规", "SOC 2 / ISO 27001"),
      ],
    },
    {
      group: L("Analytics", "数据分析"),
      items: [
        S(
          "Dashboards",
          "看板",
          "实时库存 / 订单 / 设备看板",
          "Real-time inventory / order / equipment dashboards",
        ),
        S("Reports", "报表", "50+ 标准报表模板", "50+ standard report templates"),
        S(
          "Forecasting",
          "预测",
          "AI 销量预测与补货建议",
          "AI demand forecasting & replenishment suggestions",
        ),
        S("Alerts", "告警", "库存预警多渠道推送", "Multi-channel stock alert push"),
      ],
    },
  ],
  features: [
    L(
      "Real-time inventory accuracy up to 99.9% with cycle counting",
      "动态盘点加持，库存准确率可达 99.9%",
    ),
    L("Wave planning and intelligent order orchestration", "波次规划与订单智能编排"),
    L("Native integration with HiWhale WCS robot fleets", "与浩鲸 WCS 机器人车队原生集成"),
    L("AI demand forecasting and replenishment suggestions", "AI 销量预测与智能补货建议"),
  ],
  scenarios: [E_COMMERCE, THIRD_PARTY_LOGISTICS, PHARMACEUTICAL],
  imageName: "product-hiwhale-iwms.png",
};
