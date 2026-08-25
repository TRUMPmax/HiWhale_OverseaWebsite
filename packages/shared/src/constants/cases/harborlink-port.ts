import { L, PORT } from "../products/helpers";
import type { MockCase } from "./types";

export const caseHarborLink: MockCase = {
  slug: "case-harborlink-port",
  clientName: L("HarborLink Terminal", "港联码头"),
  industry: PORT,
  project: L("Unmanned RMG Container Yard Retrofit", "轨道吊堆场无人化改造"),
  background: L(
    "HarborLink Terminal handles 2.4 million TEU annually at a Southeast Asian transshipment hub. Its 12 manually driven RMG cranes were the bottleneck of yard productivity.",
    "港联码头是东南亚中转枢纽，年吞吐量 240 万标准箱。其 12 台人工驾驶的轨道吊是堆场效率的瓶颈。",
  ),
  challenge: L(
    "Aging operators were retiring faster than replacements could be trained, and night-shift productivity dropped 30%. The terminal needed unmanned yard operations without stopping vessel schedules during the retrofit.",
    "老司机退休速度超过培养速度，夜班产能下降 30%。码头需要无人化堆场作业，且改造期间不能停船期。",
  ),
  solution: L(
    "HiWhale retrofitted all 12 RMGs with positioning, electronic anti-sway and auto-stacking systems, connected to terminal-grade scheduling. A remote operations center now lets one operator supervise four cranes and take over exceptions with one click.",
    "浩鲸为全部 12 台轨道吊加装定位、电子防摇与自动堆垛系统，接入码头级调度。远程操控中心让一名操作员同时监管四台吊车，异常一键接管。",
  ),
  equipment: [
    L("12 × MBG40T RMG automation retrofit", "12 台 MBG40T 轨道吊自动化改造"),
    L("Remote operations console ×4", "远程操控台 ×4"),
    L("Terminal-grade WCS/ECS scheduling", "码头级 WCS/ECS 调度系统"),
    L("GNSS + encoder positioning package", "GNSS + 编码器定位套件"),
  ],
  productSlugs: ["mbg40t-rail-mounted-gantry-crane"],
  duration: L("24 weeks", "24 周"),
  results: [
    { value: "+28%", label: L("Moves per Crane Hour", "单吊小时作业量提升") },
    { value: "-75%", label: L("Yard Crane Labor", "堆场司机人力减少") },
    { value: "±50mm", label: L("Auto-landing Precision", "自动着箱精度") },
    { value: "0", label: L("Missed Vessel Windows", "错过船期次数") },
  ],
  testimonial: {
    quote: L(
      "Night shift is now our most productive shift. The cranes don't get tired — and neither does our schedule.",
      "夜班如今成了产能最高的班次。吊车不会疲倦，我们的船期表也不再疲惫。",
    ),
    author: L("Ahmad Rahman", "Ahmad Rahman"),
    role: L("Terminal Operations Manager, HarborLink", "港联码头 运营经理"),
  },
  logoName: "case-logo-harborlink.png",
  imageName: "case-harborlink.png",
};
