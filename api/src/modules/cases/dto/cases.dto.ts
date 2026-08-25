import { IsArray, IsIn, IsObject, IsOptional, IsString, MinLength } from "class-validator";

export class UpsertCaseDto {
  @IsString()
  @MinLength(2)
  slug: string;

  @IsString()
  industry: string;

  @IsObject()
  clientName: { en: string; zh: string };

  @IsObject()
  project: { en: string; zh: string };

  @IsOptional()
  @IsObject()
  background?: { en: string; zh: string };

  @IsOptional()
  @IsObject()
  challenge?: { en: string; zh: string };

  @IsOptional()
  @IsObject()
  solution?: { en: string; zh: string };

  @IsOptional()
  @IsArray()
  equipment?: unknown[];

  /** 关联产品 slug 数组 */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productSlugs?: string[];

  @IsOptional()
  @IsObject()
  duration?: { en: string; zh: string };

  @IsOptional()
  @IsArray()
  results?: unknown[];

  @IsOptional()
  @IsObject()
  testimonial?: Record<string, { en: string; zh: string }>;

  @IsOptional()
  @IsString()
  logoName?: string;

  @IsOptional()
  @IsString()
  imageName?: string;

  @IsOptional()
  @IsIn(["published", "draft"])
  status?: "published" | "draft";
}

export class UpdateCaseStatusDto {
  @IsIn(["published", "draft"])
  status: "published" | "draft";
}
