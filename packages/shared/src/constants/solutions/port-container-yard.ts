import { AGV, GANTRY_CRANE, L, PORT, WCS } from "../products/helpers";
import type { MockSolution } from "./types";

export const portContainerYard: MockSolution = {
  slug: "port-container-yard",
  industry: PORT,
  title: L("Automated Port Container Yard", "自动化集装箱堆场方案"),
  summary: L(
    "Unmanned RMG cranes and yard scheduling for 24/7 terminal operations.",
    "无人化轨道吊与堆场调度，支撑码头 24/7 作业。",
  ),
  description: L(
    "Terminals win on moves per hour and berth productivity. This solution automates container yards with rail-mounted gantry cranes, automated horizontal transport and terminal-grade scheduling — delivering consistent, unmanned stacking operations around the clock with remote exception handling.",
    "码头的竞争力在于每小时作业箱量与泊位效率。本方案以轨道式龙门吊、自动化水平运输与码头级调度实现堆场自动化，全天候无人堆垛作业，异常工况远程接管。",
  ),
  painPoints: [
    L("Crane operator shortage limits terminal throughput", "司机短缺制约码头吞吐能力"),
    L("Manual yard ops cannot sustain 24/7 vessel schedules", "人工堆场作业无法匹配 24/7 船期"),
    L("Yard congestion delays vessel turnaround", "堆场拥堵拖长船舶在港时间"),
    L("Heavy-equipment accidents are the top safety risk", "大型设备事故是码头首要安全风险"),
  ],
  equipment: [GANTRY_CRANE, AGV, WCS],
  process: [
    {
      title: L("Yard Flow Modeling", "堆场物流建模"),
      description: L(
        "We simulate vessel, gate and rail peaks to size crane count and block layout.",
        "仿真船舶、闸口与铁路峰值，确定吊车数量与箱区布局。",
      ),
    },
    {
      title: L("Crane Automation Retrofit", "吊车自动化改造"),
      description: L(
        "RMGs receive positioning, anti-sway and auto-stacking systems — new build or retrofit.",
        "轨道吊加装定位、防摇与自动堆垛系统，新建或改造均可。",
      ),
    },
    {
      title: L("Horizontal Transport Automation", "水平运输自动化"),
      description: L(
        "AGVs/IGVs connect quay to yard with precise handover positioning.",
        "AGV/IGV 实现岸桥与堆场之间的精准交接。",
      ),
    },
    {
      title: L("TOS/ECS Integration", "TOS/ECS 集成"),
      description: L(
        "Terminal-grade scheduling syncs with your TOS for vessel, yard and gate planning.",
        "码头级调度与 TOS 同步，统筹船舶、堆场与闸口计划。",
      ),
    },
    {
      title: L("Remote Ops Center Go-live", "远程操控中心上线"),
      description: L(
        "Operators supervise multiple cranes remotely and take over exceptions with one click.",
        "操作员远程监管多台吊车，异常工况一键接管。",
      ),
    },
  ],
  results: [
    { value: "24/7", label: L("Unmanned Operation", "无人化连续作业") },
    { value: "+25%", label: L("Moves per Crane Hour", "单吊小时作业量提升") },
    { value: "-70%", label: L("Yard Labor", "堆场人力减少") },
    { value: "±50mm", label: L("Landing Precision", "着箱精度") },
  ],
  imageName: "solution-port.png",
};
