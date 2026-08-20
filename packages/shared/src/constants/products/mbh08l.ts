import {
  L,
  S,
  GROUP_GENERAL,
  GROUP_PERFORMANCE,
  GROUP_BATTERY,
  GROUP_SAFETY,
  GROUP_COMMUNICATION,
  AMR,
  E_COMMERCE,
  PHARMACEUTICAL,
} from "./helpers";
import type { MockProduct } from "./types";

export const mbh08l: MockProduct = {
  slug: "mbh08l-latent-lifting-amr",
  model: "MBH08L",
  category: AMR,
  name: L("Latent Lifting AMR", "潜伏顶升式 AMR"),
  tagline: L(
    "Goods-to-person transport of racks and pallets up to 800 kg.",
    "800 kg 级货架与托盘“货到人”搬运。",
  ),
  description: L(
    "The MBH08L latent lifting AMR slides under racks and trolleys, lifts them with its integrated jacking platform and delivers them to workstations. It is the workhorse of goods-to-person e-commerce fulfillment.",
    "MBH08L 潜伏顶升式 AMR 可钻入货架与料车底部，通过顶升平台举升并搬运至工作站，是电商“货到人”拣选的主力机型。",
  ),
  quickSpecs: [
    S("Payload", "额定负载", "800 kg"),
    S("Navigation", "导航方式", "LiDAR SLAM + QR"),
    S("Travel Speed", "行驶速度", "1.8 m/s"),
    S("Battery", "电池", "Li-ion 48V / 60Ah"),
  ],
  specGroups: [
    {
      group: GROUP_GENERAL,
      items: [
        S("Overall Dimensions", "整车尺寸", "1,050 × 780 × 290 mm"),
        S("Dead Weight", "自重", "180 kg"),
        S("Lifting Stroke", "顶升行程", "60 mm"),
        S("Rotation", "旋转方式", "原地 360° 旋转"),
      ],
    },
    {
      group: GROUP_PERFORMANCE,
      items: [
        S("Payload", "额定负载", "800 kg"),
        S("Travel Speed", "行驶速度", "1.8 m/s"),
        S("Positioning Accuracy", "定位精度", "±10 mm"),
        S("Gradeability", "爬坡能力", "5%"),
      ],
    },
    {
      group: GROUP_BATTERY,
      items: [
        S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
        S("Capacity", "电池容量", "48V / 60Ah"),
        S("Charging Time", "充电时长", "≤ 1.5 h（快充）"),
        S("Runtime", "续航时间", "6–8 h"),
      ],
    },
    {
      group: GROUP_SAFETY,
      items: [
        S("Safety Scanner", "安全雷达", "前后激光避障雷达"),
        S("Emergency Stop", "急停装置", "车身急停按钮 + 远程急停"),
        S("Obstacle Detection", "障碍物检测", "激光雷达 + 安全触边"),
        S("Standard", "安全标准", "CE / ISO 3691-4"),
      ],
    },
    {
      group: GROUP_COMMUNICATION,
      items: [
        S("Network", "通信网络", "Wi-Fi 6"),
        S("Protocol", "通信协议", "VDA 5050 / MQTT"),
        S("Scheduling", "调度方式", "WCS 集群调度，千台级集群"),
        S("API", "开放接口", "REST API"),
      ],
    },
  ],
  features: [
    L("Low-profile 290 mm body slides under standard racks", "290 mm 低矮机身，可潜入标准货架底部"),
    L("In-place 360° rotation for dense aisle layouts", "原地 360° 旋转，适应密集巷道布局"),
    L(
      "Fleet scaling from 10 to 1,000+ robots on one map",
      "单地图支持 10 至 1,000+ 台机器人集群扩展",
    ),
    L("Auto-charging with smart task-based energy management", "自动充电，按任务智能调度电量"),
  ],
  scenarios: [E_COMMERCE, PHARMACEUTICAL],
  imageName: "product-mbh08l.png",
};
