import { IsInt, IsObject, IsOptional, IsString, MinLength } from "class-validator";

export class UpsertGroupDto {
  @IsString()
  @MinLength(2)
  key: string;

  /** {en, zh} */
  @IsObject()
  nameJson: { en: string; zh: string };

  @IsOptional()
  @IsInt()
  sort?: number;
}

export class UpsertCategoryDto {
  @IsString()
  @MinLength(2)
  key: string;

  @IsString()
  groupId: string;

  @IsObject()
  nameJson: { en: string; zh: string };

  @IsOptional()
  @IsInt()
  sort?: number;
}
