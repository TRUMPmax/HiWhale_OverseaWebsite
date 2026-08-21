import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsIn,
  MinLength,
} from "class-validator";

export class CreateInquiryDto {
  @IsString()
  @MinLength(2, { message: "请填写姓名" })
  fullName: string;

  @IsString()
  @MinLength(2, { message: "请填写公司名称" })
  company: string;

  @IsEmail({}, { message: "邮箱格式不正确" })
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(1, { message: "请选择国家/地区" })
  country: string;

  /** ProductCategory 枚举值数组 */
  @IsArray()
  @ArrayNotEmpty({ message: "请选择意向产品" })
  categories: string[];

  @IsString()
  @MinLength(20, { message: "项目描述至少 20 个字符" })
  description: string;
}

export class ListInquiriesDto {
  @IsOptional()
  @IsIn(["NEW", "FOLLOWING", "WON", "CLOSED"])
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  pageSize?: string;
}

export class UpdateInquiryStatusDto {
  @IsIn(["NEW", "FOLLOWING", "WON", "CLOSED"])
  status: "NEW" | "FOLLOWING" | "WON" | "CLOSED";
}

export class AssignInquiryDto {
  /** 负责人姓名（员工表按姓名匹配） */
  @IsString()
  assigneeName: string;
}

export class CreateFollowUpDto {
  @IsString()
  @MinLength(1, { message: "跟进内容不能为空" })
  note: string;
}
