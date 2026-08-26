import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: "姓名至少 2 个字符" })
  name: string;

  @IsString()
  @MinLength(2, { message: "公司名称至少 2 个字符" })
  company: string;

  @IsEmail({}, { message: "邮箱格式不正确" })
  email: string;

  @IsString()
  @MinLength(8, { message: "密码至少 8 位" })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: "邮箱格式不正确" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "请输入密码" })
  password: string;
}

export class StaffLoginDto extends LoginDto {}
