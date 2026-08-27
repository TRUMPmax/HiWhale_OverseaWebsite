import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

/** 拖动排序：按数组顺序重写 sort（1..N） */
export class ReorderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}

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
