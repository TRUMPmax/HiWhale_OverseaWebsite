import { IsArray, IsIn, IsObject, IsOptional, IsString, MinLength } from "class-validator";

export class UpsertSolutionDto {
  @IsString()
  @MinLength(2)
  slug: string;

  @IsString()
  industry: string;

  // {en, zh} 本地化字段
  @IsObject()
  title: { en: string; zh: string };

  @IsOptional()
  @IsObject()
  summary?: { en: string; zh: string };

  @IsOptional()
  @IsObject()
  description?: { en: string; zh: string };

  @IsOptional()
  @IsArray()
  painPoints?: unknown[];

  /** ProductCategory 枚举值数组 */
  @IsOptional()
  @IsArray()
  equipment?: string[];

  @IsOptional()
  @IsArray()
  process?: unknown[];

  @IsOptional()
  @IsArray()
  results?: unknown[];

  @IsOptional()
  @IsString()
  imageName?: string;

  @IsOptional()
  @IsIn(["published", "draft"])
  status?: "published" | "draft";
}

export class UpdateSolutionStatusDto {
  @IsIn(["published", "draft"])
  status: "published" | "draft";
}
