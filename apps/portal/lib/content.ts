import {
  getCaseBySlug,
  getSolutionBySlug,
  getProductBySlug,
  MOCK_CASES,
  MOCK_PRODUCTS,
  MOCK_SOLUTIONS,
} from "@hiwhale/shared/constants";
import type { MockCase, MockProduct, MockSolution } from "@hiwhale/shared/constants";
import { apiGet } from "./api";

/**
 * 内容数据获取：优先 API 实时数据，API 不可用/为空时回退内置 Mock（站点永不白屏）。
 * 服务端组件内使用（cache: no-store）。
 */
export async function fetchProducts(): Promise<MockProduct[]> {
  try {
    const data = await apiGet<{ items: MockProduct[] }>("/api/products?pageSize=100");
    return data.items.length > 0 ? data.items : MOCK_PRODUCTS;
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function fetchProduct(slug: string): Promise<MockProduct | undefined> {
  try {
    return await apiGet<MockProduct>(`/api/products/${slug}`);
  } catch {
    return getProductBySlug(slug);
  }
}

export async function fetchSolutions(): Promise<MockSolution[]> {
  try {
    const data = await apiGet<{ items: MockSolution[] }>("/api/solutions");
    return data.items.length > 0 ? data.items : MOCK_SOLUTIONS;
  } catch {
    return MOCK_SOLUTIONS;
  }
}

export async function fetchSolution(slug: string): Promise<MockSolution | undefined> {
  try {
    return await apiGet<MockSolution>(`/api/solutions/${slug}`);
  } catch {
    return getSolutionBySlug(slug);
  }
}

export async function fetchCases(): Promise<MockCase[]> {
  try {
    const data = await apiGet<{ items: MockCase[] }>("/api/cases");
    return data.items.length > 0 ? data.items : MOCK_CASES;
  } catch {
    return MOCK_CASES;
  }
}

export async function fetchCase(slug: string): Promise<MockCase | undefined> {
  try {
    return await apiGet<MockCase>(`/api/cases/${slug}`);
  } catch {
    return getCaseBySlug(slug);
  }
}
