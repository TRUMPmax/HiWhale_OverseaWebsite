import type { MockSolution } from "./types";
import { ecommerceFulfillment } from "./ecommerce-fulfillment";
import { automotiveLineSide } from "./automotive-line-side";
import { threePlMultiClient } from "./3pl-multi-client";
import { coldChainAutomation } from "./cold-chain-automation";
import { pharmaCompliantLogistics } from "./pharma-compliant-logistics";
import { portContainerYard } from "./port-container-yard";

export * from "./types";

/** Mock 行业方案（6 个行业各一） */
export const MOCK_SOLUTIONS: MockSolution[] = [
  ecommerceFulfillment,
  automotiveLineSide,
  threePlMultiClient,
  coldChainAutomation,
  pharmaCompliantLogistics,
  portContainerYard,
];

/** 按 slug 查询方案 */
export function getSolutionBySlug(slug: string): MockSolution | undefined {
  return MOCK_SOLUTIONS.find((s) => s.slug === slug);
}
