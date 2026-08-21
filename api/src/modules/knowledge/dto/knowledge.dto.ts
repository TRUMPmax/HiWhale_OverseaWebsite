import { IsIn, IsOptional, IsString, MinLength } from "class-validator";

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
