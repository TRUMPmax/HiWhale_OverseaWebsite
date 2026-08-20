import type { Industry, Locale, ProductCategory } from "./index";

/** 本地化文案 */
export type LocalizedText = Record<Locale, string>;

export type MockSpecItem = {
  label: LocalizedText;
  value: string;
};

export type MockSpecGroup = {
  group: LocalizedText;
  items: MockSpecItem[];
};

/** Stage 4 产品详情页使用的 Mock 产品类型（后续由数据库 Product 替换） */
export type MockProduct = {
  slug: string;
  model: string;
  category: ProductCategory;
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  /** 核心参数（列表卡片 / 详情页头部），3-4 项 */
  quickSpecs: MockSpecItem[];
  /** 分组完整规格表 */
  specGroups: MockSpecGroup[];
  /** 核心特性，3-4 条 */
  features: LocalizedText[];
  /** 适用行业，2-3 个 */
  scenarios: Industry[];
  /** 产品实拍图素材文件名 */
  imageName: string;
};

/** 便捷构造本地化文案 */
function L(en: string, zh: string): LocalizedText {
  return { en, zh };
}

/** 便捷构造规格项 */
function S(en: string, zh: string, value: string): MockSpecItem {
  return { label: L(en, zh), value };
}

/** 枚举值（与 ProductCategory / Industry 字符串枚举一致，类型导入避免运行时循环依赖） */
const AGV_FORKLIFT = "AGV_FORKLIFT" as ProductCategory;
const AMR = "AMR" as ProductCategory;
const MANNED_FORKLIFT = "MANNED_FORKLIFT" as ProductCategory;
const ROBOTIC_ARM = "ROBOTIC_ARM" as ProductCategory;
const GANTRY_CRANE = "GANTRY_CRANE" as ProductCategory;
const SYSTEM_SOFTWARE = "SYSTEM_SOFTWARE" as ProductCategory;

const E_COMMERCE = "E_COMMERCE" as Industry;
const AUTOMOTIVE = "AUTOMOTIVE" as Industry;
const THIRD_PARTY_LOGISTICS = "THIRD_PARTY_LOGISTICS" as Industry;
const FOOD_COLD_CHAIN = "FOOD_COLD_CHAIN" as Industry;
const PHARMACEUTICAL = "PHARMACEUTICAL" as Industry;
const PORT = "PORT" as Industry;

/** 常用规格组标题 */
const GROUP_GENERAL = L("General", "基本参数");
const GROUP_PERFORMANCE = L("Performance", "性能参数");
const GROUP_BATTERY = L("Battery", "电池系统");
const GROUP_SAFETY = L("Safety", "安全防护");
const GROUP_COMMUNICATION = L("Communication", "通信与调度");

/** Stage 4 Mock 产品数据：8 款产品，覆盖全部 6 大品类 */
export const MOCK_PRODUCTS: MockProduct[] = [
  {
    slug: "mbv15r-counterbalanced-agv-forklift",
    model: "MBV15R",
    category: AGV_FORKLIFT,
    name: L("Counterbalanced AGV Forklift", "平衡重式无人叉车"),
    tagline: L(
      "Automated pallet transport and stacking for loads up to 1.5 t.",
      "1.5 吨级自动化托盘搬运与堆垛。",
    ),
    description: L(
      "The MBV15R is a counterbalanced AGV forklift designed for automated pallet transport, stacking and dock docking. With LiDAR SLAM navigation and ±10 mm positioning accuracy, it integrates seamlessly into existing racking and conveyor layouts without infrastructure changes.",
      "MBV15R 平衡重式无人叉车面向自动化托盘搬运、堆垛与月台对接场景。采用激光 SLAM 导航，定位精度 ±10 mm，无需改造场地即可接入现有货架与输送线布局。",
    ),
    quickSpecs: [
      S("Load Capacity", "额定载重", "1,500 kg"),
      S("Lift Height", "起升高度", "3,000 mm"),
      S("Navigation", "导航方式", "LiDAR SLAM"),
      S("Battery", "电池", "Li-ion 48V / 200Ah"),
    ],
    specGroups: [
      {
        group: GROUP_GENERAL,
        items: [
          S("Overall Dimensions", "整车尺寸", "2,650 × 1,100 × 2,150 mm"),
          S("Dead Weight", "自重", "2,800 kg"),
          S("Fork Size", "货叉尺寸", "1,070 × 125 × 45 mm"),
          S("Turning Radius", "转弯半径", "1,750 mm"),
        ],
      },
      {
        group: GROUP_PERFORMANCE,
        items: [
          S("Load Capacity", "额定载重", "1,500 kg"),
          S("Lift Height", "起升高度", "3,000 mm"),
          S("Travel Speed", "行驶速度", "1.5 m/s"),
          S("Positioning Accuracy", "定位精度", "±10 mm"),
        ],
      },
      {
        group: GROUP_BATTERY,
        items: [
          S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
          S("Capacity", "电池容量", "48V / 200Ah"),
          S("Charging Time", "充电时长", "≤ 2 h（快充）"),
          S("Runtime", "续航时间", "6–8 h"),
        ],
      },
      {
        group: GROUP_SAFETY,
        items: [
          S("Safety Scanner", "安全雷达", "2 × 360° 激光扫描仪"),
          S("Emergency Stop", "急停装置", "车身前后急停按钮"),
          S("Obstacle Detection", "障碍物检测", "3D 视觉 + 安全触边"),
          S("Standard", "安全标准", "ISO 3691-4"),
        ],
      },
      {
        group: GROUP_COMMUNICATION,
        items: [
          S("Network", "通信网络", "Wi-Fi 6 / 5G"),
          S("Protocol", "通信协议", "VDA 5050 / Modbus TCP"),
          S("Scheduling", "调度方式", "WCS 集群调度"),
          S("API", "开放接口", "REST API"),
        ],
      },
    ],
    features: [
      L(
        "LiDAR SLAM navigation, no reflectors or floor markers required",
        "激光 SLAM 导航，无需反光板与地面标识",
      ),
      L(
        "±10 mm pallet positioning with 3D vision fork guidance",
        "3D 视觉货叉引导，托盘定位精度 ±10 mm",
      ),
      L(
        "Opportunity charging for 24/7 multi-shift operation",
        "支持机会充电，满足 24/7 多班次作业",
      ),
      L("Seamless docking with conveyors, racks and dock doors", "与输送线、货架、月台无缝对接"),
    ],
    scenarios: [E_COMMERCE, THIRD_PARTY_LOGISTICS],
    imageName: "product-mbv15r.png",
  },
  {
    slug: "mbv20p-stacker-agv-forklift",
    model: "MBV20P",
    category: AGV_FORKLIFT,
    name: L("High-Lift Stacker AGV Forklift", "高举升堆垛式无人叉车"),
    tagline: L(
      "High-bay stacking up to 4.5 m for narrow-aisle warehouses.",
      "最高 4.5 米高位堆垛，适配窄巷道仓库。",
    ),
    description: L(
      "The MBV20P stacker AGV handles pallets up to 2,000 kg and stacks them as high as 4,500 mm, making it ideal for high-bay and narrow-aisle warehouses. Laser SLAM plus QR hybrid navigation keeps it reliable even in dynamic environments.",
      "MBV20P 堆垛式无人叉车可搬运 2,000 kg 托盘并堆垛至 4,500 mm 高位，适用于高位立体库与窄巷道仓库。激光 SLAM + 二维码混合导航，在动态环境中依然稳定可靠。",
    ),
    quickSpecs: [
      S("Load Capacity", "额定载重", "2,000 kg"),
      S("Lift Height", "起升高度", "4,500 mm"),
      S("Navigation", "导航方式", "LiDAR SLAM + QR"),
      S("Battery", "电池", "Li-ion 48V / 300Ah"),
    ],
    specGroups: [
      {
        group: GROUP_GENERAL,
        items: [
          S("Overall Dimensions", "整车尺寸", "2,350 × 1,050 × 2,400 mm"),
          S("Dead Weight", "自重", "3,200 kg"),
          S("Fork Size", "货叉尺寸", "1,150 × 140 × 50 mm"),
          S("Min. Aisle Width", "最小通道宽度", "2,200 mm"),
        ],
      },
      {
        group: GROUP_PERFORMANCE,
        items: [
          S("Load Capacity", "额定载重", "2,000 kg"),
          S("Lift Height", "起升高度", "4,500 mm"),
          S("Travel Speed", "行驶速度", "1.2 m/s"),
          S("Positioning Accuracy", "定位精度", "±10 mm"),
        ],
      },
      {
        group: GROUP_BATTERY,
        items: [
          S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
          S("Capacity", "电池容量", "48V / 300Ah"),
          S("Charging Time", "充电时长", "≤ 2.5 h（快充）"),
          S("Runtime", "续航时间", "8 h"),
        ],
      },
      {
        group: GROUP_SAFETY,
        items: [
          S("Safety Scanner", "安全雷达", "2 × 360° 激光扫描仪"),
          S("Emergency Stop", "急停装置", "车身四周急停按钮"),
          S("Obstacle Detection", "障碍物检测", "3D 视觉 + 安全触边 + 声光报警"),
          S("Standard", "安全标准", "ISO 3691-4 / CE"),
        ],
      },
      {
        group: GROUP_COMMUNICATION,
        items: [
          S("Network", "通信网络", "Wi-Fi 6 / 5G"),
          S("Protocol", "通信协议", "VDA 5050 / Modbus TCP"),
          S("Scheduling", "调度方式", "WCS 集群调度"),
          S("API", "开放接口", "REST API"),
        ],
      },
    ],
    features: [
      L("4,500 mm high-lift stacking for high-bay racking", "4,500 mm 高位堆垛，适配高位立体货架"),
      L(
        "Hybrid LiDAR SLAM + QR navigation for dynamic floors",
        "激光 SLAM + 二维码混合导航，适应动态作业环境",
      ),
      L("Narrow-aisle operation from 2,200 mm aisle width", "最小 2,200 mm 通道宽度内作业"),
      L("Automatic fork leveling at height for safe stacking", "高位自动调平货叉，堆垛更安全"),
    ],
    scenarios: [E_COMMERCE, AUTOMOTIVE],
    imageName: "product-mbv20p.png",
  },
  {
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
      L(
        "Low-profile 290 mm body slides under standard racks",
        "290 mm 低矮机身，可潜入标准货架底部",
      ),
      L("In-place 360° rotation for dense aisle layouts", "原地 360° 旋转，适应密集巷道布局"),
      L(
        "Fleet scaling from 10 to 1,000+ robots on one map",
        "单地图支持 10 至 1,000+ 台机器人集群扩展",
      ),
      L("Auto-charging with smart task-based energy management", "自动充电，按任务智能调度电量"),
    ],
    scenarios: [E_COMMERCE, PHARMACEUTICAL],
    imageName: "product-mbh08l.png",
  },
  {
    slug: "mbt10r-roller-top-amr",
    model: "MBT10R",
    category: AMR,
    name: L("Roller-Top Transfer AMR", "辊筒对接式 AMR"),
    tagline: L(
      "Automated conveyor docking for totes, cartons and bins up to 1 t.",
      "1 吨级料箱/纸箱输送线自动对接搬运。",
    ),
    description: L(
      "The MBT10R roller-top AMR docks directly with conveyors and packing stations to transfer totes, cartons and bins automatically — closing the last gap between production lines and warehouse automation.",
      "MBT10R 辊筒对接式 AMR 可与输送线、包装工位直接对接，自动移载料箱、纸箱与周转箱，打通产线与仓储自动化之间的最后一环。",
    ),
    quickSpecs: [
      S("Payload", "额定负载", "1,000 kg"),
      S("Navigation", "导航方式", "LiDAR SLAM"),
      S("Transfer Speed", "移载速度", "0.3 m/s"),
      S("Battery", "电池", "Li-ion 48V / 100Ah"),
    ],
    specGroups: [
      {
        group: GROUP_GENERAL,
        items: [
          S("Overall Dimensions", "整车尺寸", "1,400 × 950 × 850 mm"),
          S("Dead Weight", "自重", "350 kg"),
          S("Roller Height", "辊筒面高度", "800 mm（可定制 650–1,000 mm）"),
          S("Docking Width", "对接宽度", "600 mm"),
        ],
      },
      {
        group: GROUP_PERFORMANCE,
        items: [
          S("Payload", "额定负载", "1,000 kg"),
          S("Travel Speed", "行驶速度", "1.5 m/s"),
          S("Transfer Speed", "移载速度", "0.3 m/s"),
          S("Docking Accuracy", "对接精度", "±5 mm"),
        ],
      },
      {
        group: GROUP_BATTERY,
        items: [
          S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
          S("Capacity", "电池容量", "48V / 100Ah"),
          S("Charging Time", "充电时长", "≤ 2 h（快充）"),
          S("Runtime", "续航时间", "8 h"),
        ],
      },
      {
        group: GROUP_SAFETY,
        items: [
          S("Safety Scanner", "安全雷达", "2 × 激光避障雷达"),
          S("Emergency Stop", "急停装置", "车身急停按钮 + 远程急停"),
          S("Obstacle Detection", "障碍物检测", "激光雷达 + 3D 视觉"),
          S("Standard", "安全标准", "CE / ISO 3691-4"),
        ],
      },
      {
        group: GROUP_COMMUNICATION,
        items: [
          S("Network", "通信网络", "Wi-Fi 6 / 5G"),
          S("Protocol", "通信协议", "VDA 5050 / Modbus TCP"),
          S("Scheduling", "调度方式", "WCS 集群调度"),
          S("API", "开放接口", "REST API"),
        ],
      },
    ],
    features: [
      L(
        "Powered roller deck docks with any standard conveyor",
        "动力辊筒台面，可与标准输送线任意对接",
      ),
      L("±5 mm docking accuracy for reliable load transfer", "±5 mm 对接精度，移载稳定可靠"),
      L("Customizable roller height from 650 to 1,000 mm", "辊筒高度 650–1,000 mm 可定制"),
      L("Bi-directional transfer for flexible line layouts", "双向移载，适配柔性产线布局"),
    ],
    scenarios: [AUTOMOTIVE, THIRD_PARTY_LOGISTICS],
    imageName: "product-mbt10r.png",
  },
  {
    slug: "mbf35e-electric-counterbalanced-forklift",
    model: "MBF35E",
    category: MANNED_FORKLIFT,
    name: L("Electric Counterbalanced Forklift", "电动平衡重式叉车"),
    tagline: L(
      "3.5 t Li-ion workhorse for hybrid and transitional operations.",
      "3.5 吨锂电主力车型，适配人机混合作业。",
    ),
    description: L(
      "The MBF35E electric counterbalanced forklift delivers diesel-grade performance with zero emissions. Its Li-ion battery supports opportunity charging for multi-shift operations, and it can be retrofitted with HiWhale autonomy kits later.",
      "MBF35E 电动平衡重式叉车以零排放提供媲美柴油车的性能。锂电池支持机会充电满足多班次作业，后期可加装浩鲸自动驾驶套件升级为无人叉车。",
    ),
    quickSpecs: [
      S("Load Capacity", "额定载重", "3,500 kg"),
      S("Lift Height", "起升高度", "4,800 mm"),
      S("Battery", "电池", "Li-ion 80V / 460Ah"),
      S("Runtime", "续航时间", "8 h"),
    ],
    specGroups: [
      {
        group: GROUP_GENERAL,
        items: [
          S("Overall Dimensions", "整车尺寸", "3,650 × 1,230 × 2,250 mm"),
          S("Dead Weight", "自重", "5,400 kg"),
          S("Fork Size", "货叉尺寸", "1,070 × 125 × 50 mm"),
          S("Turning Radius", "转弯半径", "2,250 mm"),
        ],
      },
      {
        group: GROUP_PERFORMANCE,
        items: [
          S("Load Capacity", "额定载重", "3,500 kg"),
          S("Lift Height", "起升高度", "4,800 mm"),
          S("Travel Speed", "行驶速度", "18 km/h"),
          S("Gradeability", "爬坡能力", "20%"),
        ],
      },
      {
        group: GROUP_BATTERY,
        items: [
          S("Battery Type", "电池类型", "Li-ion 磷酸铁锂"),
          S("Capacity", "电池容量", "80V / 460Ah"),
          S("Charging Time", "充电时长", "≤ 2 h（快充）"),
          S("Runtime", "续航时间", "8 h"),
        ],
      },
      {
        group: GROUP_SAFETY,
        items: [
          S("Operator Protection", "驾驶员保护", "OPS 驾驶在位感应系统"),
          S("Stability", "稳定性", "弯道自动减速 + 门架缓冲"),
          S("Visibility", "视野", "宽视野门架 + LED 作业灯"),
          S("Standard", "安全标准", "CE / ISO 6292"),
        ],
      },
      {
        group: GROUP_COMMUNICATION,
        items: [
          S("Telematics", "车队管理", "车载 4G 远程诊断终端"),
          S("Protocol", "通信协议", "CAN bus / Modbus"),
          S("Fleet System", "车队系统", "可选配 FMS 车队管理"),
          S("Upgrade Path", "升级路径", "支持加装自动驾驶套件"),
        ],
      },
    ],
    features: [
      L("Zero-emission Li-ion power with opportunity charging", "锂电零排放，支持机会充电"),
      L("20% gradeability for yard and ramp operations", "20% 爬坡能力，胜任堆场与坡道作业"),
      L("Operator-presence sensing and curve speed control", "驾驶在位感应与弯道自动减速"),
      L("Retrofittable with HiWhale autonomy kit", "可加装浩鲸自动驾驶套件升级为无人车"),
    ],
    scenarios: [FOOD_COLD_CHAIN, THIRD_PARTY_LOGISTICS],
    imageName: "product-mbf35e.png",
  },
  {
    slug: "mbr160-palletizing-robotic-arm",
    model: "MBR160",
    category: ROBOTIC_ARM,
    name: L("Palletizing Robotic Arm", "码垛机械臂"),
    tagline: L(
      "160 kg payload palletizing at up to 1,200 cycles per hour.",
      "160 kg 负载码垛，最高每小时 1,200 循环。",
    ),
    description: L(
      "The MBR160 palletizing robotic arm handles cartons, bags and totes up to 160 kg with a 3,150 mm reach. Integrated 3D vision enables mixed-SKU depalletizing and automatic pattern generation for stable, dense pallets.",
      "MBR160 码垛机械臂可搬运 160 kg 以内的纸箱、袋包与料箱，臂展 3,150 mm。集成 3D 视觉，支持混码拆垛与自动垛型生成，码垛整齐致密。",
    ),
    quickSpecs: [
      S("Payload", "额定负载", "160 kg"),
      S("Reach", "臂展", "3,150 mm"),
      S("Cycle Rate", "循环节拍", "≤ 1,200 次/小时"),
      S("Repeatability", "重复定位精度", "±0.1 mm"),
    ],
    specGroups: [
      {
        group: GROUP_GENERAL,
        items: [
          S("Axes", "轴数", "4 轴"),
          S("Dead Weight", "自重", "1,150 kg"),
          S("Mounting", "安装方式", "地面安装"),
          S("Protection Rating", "防护等级", "IP54（腕部 IP67）"),
        ],
      },
      {
        group: GROUP_PERFORMANCE,
        items: [
          S("Payload", "额定负载", "160 kg"),
          S("Reach", "臂展", "3,150 mm"),
          S("Cycle Rate", "循环节拍", "≤ 1,200 次/小时"),
          S("Repeatability", "重复定位精度", "±0.1 mm"),
        ],
      },
      {
        group: L("Power", "动力系统"),
        items: [
          S("Power Supply", "电源", "380V / 3 相 / 50-60Hz"),
          S("Rated Power", "额定功率", "8 kW"),
          S("Servo", "伺服系统", "绝对值编码器伺服电机"),
          S("Brake", "制动", "全轴抱闸"),
        ],
      },
      {
        group: GROUP_SAFETY,
        items: [
          S("Safety Controller", "安全控制器", "安全 PLC，PL d / Cat.3"),
          S("Safeguarding", "防护方式", "安全围栏 + 光幕 + 安全门锁"),
          S("Collision Detection", "碰撞检测", "全轴力矩碰撞检测"),
          S("Standard", "安全标准", "ISO 10218-1 / CE"),
        ],
      },
      {
        group: GROUP_COMMUNICATION,
        items: [
          S("Fieldbus", "现场总线", "EtherCAT / PROFINET"),
          S("Vision", "视觉系统", "3D 视觉拆垛 + 垛型规划"),
          S("Scheduling", "调度方式", "接入 WCS 统一调度"),
          S("API", "开放接口", "REST API / SDK"),
        ],
      },
    ],
    features: [
      L("3D vision mixed-SKU depalletizing out of the box", "开箱即用的 3D 视觉混码拆垛"),
      L("Automatic pallet pattern generation for dense stacking", "自动生成垛型，码垛致密稳固"),
      L("Quick-change gripper for cartons, bags and totes", "快换夹具，兼容纸箱、袋包与料箱"),
      L("Up to 1,200 cycles per hour sustained throughput", "持续节拍最高 1,200 次/小时"),
    ],
    scenarios: [FOOD_COLD_CHAIN, PHARMACEUTICAL, E_COMMERCE],
    imageName: "product-mbr160.png",
  },
  {
    slug: "mbg40t-rail-mounted-gantry-crane",
    model: "MBG40T",
    category: GANTRY_CRANE,
    name: L("Rail-Mounted Gantry Crane (RMG)", "轨道式集装箱龙门吊"),
    tagline: L(
      "Automated 40.5 t container handling for yards and terminals.",
      "40.5 吨级自动化集装箱堆场作业。",
    ),
    description: L(
      "The MBG40T rail-mounted gantry crane automates container stacking in yards and port terminals. With a 40.5 t rated load, 30 m span and full automation package, it delivers precise, unmanned container handling around the clock.",
      "MBG40T 轨道式集装箱龙门吊面向堆场与港口码头的自动化集装箱堆垛作业。额定载荷 40.5 吨、跨距 30 m，全自动化套件支持全天候无人化精准作业。",
    ),
    quickSpecs: [
      S("Rated Load", "额定载荷", "40.5 t"),
      S("Span", "跨距", "30 m"),
      S("Lifting Height", "起升高度", "18 m（堆 5 过 6）"),
      S("Automation", "自动化", "全自动无人作业"),
    ],
    specGroups: [
      {
        group: GROUP_GENERAL,
        items: [
          S("Span", "跨距", "30 m"),
          S("Lifting Height", "起升高度", "18 m"),
          S("Spreader", "吊具", "20' / 40' / 45' 伸缩吊具"),
          S("Duty Class", "工作级别", "A8"),
        ],
      },
      {
        group: GROUP_PERFORMANCE,
        items: [
          S("Rated Load", "额定载荷", "40.5 t（吊具下）"),
          S("Hoisting Speed", "起升速度", "满载 28 m/min / 空载 56 m/min"),
          S("Trolley Speed", "小车速度", "70 m/min"),
          S("Gantry Speed", "大车速度", "120 m/min"),
        ],
      },
      {
        group: L("Power Supply", "动力系统"),
        items: [
          S("Power Supply", "供电方式", "10 kV 电缆卷筒 / 滑触线"),
          S("Installed Power", "装机容量", "320 kW"),
          S("Energy Recovery", "能量回馈", "起升下降势能回馈电网"),
          S("Drive", "驱动方式", "全变频驱动"),
        ],
      },
      {
        group: GROUP_SAFETY,
        items: [
          S("Anti-Sway", "防摇系统", "电子防摇，摆动 ±50 mm"),
          S("Protection", "安全防护", "防雷 / 防风锚定 / 大车防撞"),
          S("Monitoring", "状态监测", "CMS 起重机健康管理系统"),
          S("Standard", "安全标准", "FEM 1.001 / GB/T 3811"),
        ],
      },
      {
        group: GROUP_COMMUNICATION,
        items: [
          S("Network", "通信网络", "5G / 光纤环网"),
          S("Positioning", "定位方式", "GNSS + 编码器 + 激光扫描"),
          S("Scheduling", "调度方式", "对接 TOS / ECS 堆场系统"),
          S("Remote Ops", "远程操作", "远程操控台一键接管"),
        ],
      },
    ],
    features: [
      L("Fully automated unmanned container stacking, 24/7", "全自动无人化集装箱堆垛，全天候作业"),
      L("Electronic anti-sway keeps swing within ±50 mm", "电子防摇，吊具摆动控制在 ±50 mm"),
      L("Regenerative energy recovery lowers operating cost", "势能回馈电网，降低运营能耗"),
      L("Remote takeover console for exception handling", "远程操控台一键接管，处理异常工况"),
    ],
    scenarios: [PORT, THIRD_PARTY_LOGISTICS],
    imageName: "product-mbg40t.png",
  },
  {
    slug: "hiwhale-wcs-fleet-scheduling-system",
    model: "MBW-WCS",
    category: SYSTEM_SOFTWARE,
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
      S("Deployment", "部署方式", "本地 / 私有云"),
      S("Devices per Cluster", "单集群设备数", "500+"),
      S("Dispatch Latency", "调度延迟", "< 100 ms"),
      S("API", "开放接口", "Open REST API"),
    ],
    specGroups: [
      {
        group: GROUP_GENERAL,
        items: [
          S("Deployment", "部署方式", "本地部署 / 私有云"),
          S("Server OS", "服务器系统", "Linux / Windows Server"),
          S("Client", "客户端", "Web（Chrome / Edge）"),
          S("Languages", "界面语言", "中文 / English"),
        ],
      },
      {
        group: GROUP_PERFORMANCE,
        items: [
          S("Devices per Cluster", "单集群设备数", "500+"),
          S("Concurrent Tasks", "并发任务", "10,000+"),
          S("Dispatch Latency", "调度延迟", "< 100 ms"),
          S("Availability", "可用性", "99.9%（双机热备）"),
        ],
      },
      {
        group: L("Security", "数据安全"),
        items: [
          S("Access Control", "权限管理", "RBAC 角色权限体系"),
          S("Encryption", "传输加密", "TLS 1.3"),
          S("Audit", "审计", "全量操作审计日志"),
          S("Backup", "备份", "定时快照 + 异地容灾"),
        ],
      },
      {
        group: GROUP_COMMUNICATION,
        items: [
          S("Robot Protocol", "机器人协议", "VDA 5050 / 私有协议适配"),
          S("Upstream", "上游对接", "WMS / ERP / MES（REST / WebService）"),
          S("Downstream", "下游对接", "PLC / 输送线 / 提升机 / 月台"),
          S("Monitoring", "监控", "实时地图 + 看板 + 告警推送"),
        ],
      },
    ],
    features: [
      L(
        "Mixed-fleet orchestration across brands and device types",
        "跨品牌、跨设备类型的混合车队统一编排",
      ),
      L(
        "Real-time traffic control with deadlock-free path planning",
        "实时交通管制，无死锁路径规划",
      ),
      L(
        "Digital twin map with live device and task status",
        "数字孪生地图，实时呈现设备与任务状态",
      ),
      L("Simulation mode validates layouts before go-live", "仿真模式，上线前验证布局与吞吐"),
    ],
    scenarios: [E_COMMERCE, AUTOMOTIVE, THIRD_PARTY_LOGISTICS],
    imageName: "product-mbw-wcs.png",
  },
];
