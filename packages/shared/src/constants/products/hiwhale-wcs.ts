import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_COMMUNICATION,
  WCS,
  E_COMMERCE,
  AUTOMOTIVE,
  THIRD_PARTY_LOGISTICS,
} from "./helpers";
import type { MockProduct } from "./types";

export const hiwhaleWcs: MockProduct = {
  slug: "hiwhale-wcs-fleet-scheduling-system",
  model: "MBW-WCS",
  category: WCS,
  name: L("HiWhale WCS Fleet Scheduling System", "浩鲸 WCS 调度系统"),
  tagline: L(
    "One brain orchestrating every robot, conveyor and dock in your warehouse.",
    "一个大脑，统一调度仓库中的每台机器人、输送线与月台。",
  ),
  description: L(
    "HiWhale WCS orchestrates AGVs, AMRs, robotic arms, conveyors and dock equipment as one coordinated fleet. Real-time traffic management, task optimization and open APIs connect it to any WMS, ERP or MES.",
    "浩鲸 WCS 将 AGV、AMR、机械臂、输送线与月台设备统一编排为一支协同车队。实时交通管理、任务优化与开放 API，可对接任意 WMS、ERP 或 MES 系统。",
  ),
  quickSpecs: [
    S("Deployment", "部署方式", "本地 / 私有云", "On-prem / private cloud"),
    S("Devices per Cluster", "单集群设备数", "500+"),
    S("Dispatch Latency", "调度延迟", "< 100 ms"),
    S("API", "开放接口", "Open REST API"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Deployment", "部署方式", "本地部署 / 私有云", "On-premises / private cloud"),
        S("Server OS", "服务器系统", "Linux / Windows Server"),
        S("Client", "客户端", "Web（Chrome / Edge）"),
        S("Languages", "界面语言", "中文 / English", "Chinese / English"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Devices per Cluster", "单集群设备数", "500+"),
        S("Concurrent Tasks", "并发任务", "10,000+"),
        S("Dispatch Latency", "调度延迟", "< 100 ms"),
        S("Availability", "可用性", "99.9%（双机热备）", "99.9% (dual hot standby)"),
      ],
    },
    {
      group: L("Security", "数据安全"),
      items: [
        S("Access Control", "权限管理", "RBAC 角色权限体系", "RBAC role-based access control"),
        S("Encryption", "传输加密", "TLS 1.3"),
        S("Audit", "审计", "全量操作审计日志", "Full operation audit logs"),
        S("Backup", "备份", "定时快照 + 异地容灾", "Scheduled snapshots + geo-disaster recovery"),
      ],
    },
    {
      group: GROUP_COMMUNICATION,
      items: [
        S(
          "Robot Protocol",
          "机器人协议",
          "VDA 5050 / 私有协议适配",
          "VDA 5050 / proprietary protocol adapters",
        ),
        S("Upstream", "上游对接", "WMS / ERP / MES（REST / WebService）"),
        S(
          "Downstream",
          "下游对接",
          "PLC / 输送线 / 提升机 / 月台",
          "PLC / conveyors / lifts / dock doors",
        ),
        S(
          "Monitoring",
          "监控",
          "实时地图 + 看板 + 告警推送",
          "Real-time map + dashboards + alert push",
        ),
      ],
    },
  ],
  features: [
    L(
      "Mixed-fleet orchestration across brands and device types",
      "跨品牌、跨设备类型的混合车队统一编排",
    ),
    L("Real-time traffic control with deadlock-free path planning", "实时交通管制，无死锁路径规划"),
    L("Digital twin map with live device and task status", "数字孪生地图，实时呈现设备与任务状态"),
    L("Simulation mode validates layouts before go-live", "仿真模式，上线前验证布局与吞吐"),
  ],
  scenarios: [E_COMMERCE, AUTOMOTIVE, THIRD_PARTY_LOGISTICS],
  imageName: "product-mbw-wcs.png",
};
