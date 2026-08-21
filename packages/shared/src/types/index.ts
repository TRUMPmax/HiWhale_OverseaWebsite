import { InquiryStatus, ProductCategory, UserRole } from "../constants";

/** 共享 TypeScript 类型定义 */

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  model: string;
  specs: ProductSpec[];
  images: string[];
  description: string;
  features: string[];
};

export type SolutionStep = {
  title: string;
  description: string;
};

export type Solution = {
  id: string;
  slug: string;
  industry: string;
  title: string;
  description: string;
  painPoints: string[];
  process: SolutionStep[];
  results: string[];
  relatedProducts: string[];
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  clientName: string;
  industry: string;
  background: string;
  challenge: string;
  solution: string;
  results: string[];
  testimonial?: Testimonial;
};

export type Inquiry = {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  country: string;
  categories: ProductCategory[];
  description: string;
  status: InquiryStatus;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  country?: string;
  role: UserRole;
  status: "active" | "disabled";
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};
