import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpsertFaqDto {
  @IsString()
  @MinLength(1, { message: "问题不能为空" })
  question: string;

  @IsString()
  @MinLength(1, { message: "答案不能为空" })
  answer: string;

  @IsOptional()
  @IsString()
  questionEn?: string;

  @IsOptional()
  @IsString()
  answerEn?: string;
}

/** FAQ 批量导入：UTF-8 CSV 全文（列：question,answer,questionEn,answerEn；首行表头可选） */
export class ImportFaqsDto {
  @IsString()
  @MaxLength(2_000_000, { message: "CSV 内容过大（上限 2MB）" })
  csv: string;
}

export class UploadDocMetaDto {
  @IsOptional()
  @IsString()
  productModel?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(["zh", "en"])
  language?: string;
}
