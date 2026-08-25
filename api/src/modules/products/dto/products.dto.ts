import {
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";

export class ListProductsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsString()
  search?: string;

  /** on / off / all（公开接口强制 on） */
  @IsOptional()
  @IsIn(["on", "off", "all"])
  status?: string;
}

export class UpsertProductDto {
  @IsString()
  @MinLength(2)
  slug: string;

  @IsString()
  @MinLength(2)
  model: string;

  @IsString()
  category: string;

  @IsString()
  group: string;

  /** {en, zh} */
  @IsObject()
  name: { en: string; zh: string };

  @IsOptional()
  @IsObject()
  tagline?: { en: string; zh: string };

  @IsOptional()
  @IsObject()
  description?: { en: string; zh: string };

  @IsOptional()
  @IsArray()
  quickSpecs?: unknown[];

  @IsOptional()
  @IsArray()
  specGroups?: unknown[];

  @IsOptional()
  @IsArray()
  features?: unknown[];

  @IsOptional()
  @IsArray()
  scenarios?: string[];

  @IsOptional()
  @IsString()
  imageName?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  specUrl?: string;

  @IsOptional()
  @IsString()
  modelUrl?: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @IsOptional()
  @IsIn(["on", "off"])
  status?: "on" | "off";
}

export class UpdateStatusDto {
  @IsIn(["on", "off"])
  status: "on" | "off";
}
