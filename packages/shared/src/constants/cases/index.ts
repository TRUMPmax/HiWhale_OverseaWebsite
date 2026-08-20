import type { MockCase } from "./types";
import { caseGlobalEcom } from "./globalecom-fulfillment";
import { caseNordAuto } from "./nordauto-line-side";
import { caseSwiftServe } from "./swiftserve-multiclient";
import { caseFreshChain } from "./freshchain-cold";
import { caseMediPharma } from "./medipharma-gmp";
import { caseHarborLink } from "./harborlink-port";

export * from "./types";

/** Mock 客户案例（6 个行业各一） */
export const MOCK_CASES: MockCase[] = [
  caseGlobalEcom,
  caseNordAuto,
  caseSwiftServe,
  caseFreshChain,
  caseMediPharma,
  caseHarborLink,
];

/** 按 slug 查询案例 */
export function getCaseBySlug(slug: string): MockCase | undefined {
  return MOCK_CASES.find((c) => c.slug === slug);
}
