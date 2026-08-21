import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

const ROLES = ["SUPER_ADMIN", "SALES", "PRODUCT_TECH", "OPERATIONS"] as const;

export class CreateStaffDto {
  @IsString()
  @MinLength(2, { message: "姓名至少 2 个字符" })
  name: string;

  @IsEmail({}, { message: "邮箱格式不正确" })
  email: string;

  @IsIn(ROLES)
  role: (typeof ROLES)[number];

  @IsString()
  @MinLength(6, { message: "初始密码至少 6 位" })
  password: string;
}

export class UpdateStaffDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsIn(ROLES)
  role?: (typeof ROLES)[number];
}

export class UpdateStaffStatusDto {
  @IsIn(["active", "disabled"])
  status: "active" | "disabled";
}
