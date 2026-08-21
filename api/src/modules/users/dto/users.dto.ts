import { IsIn, IsOptional, IsString } from "class-validator";

export class ListUsersDto {
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

export class UpdateUserStatusDto {
  @IsIn(["active", "disabled"])
  status: "active" | "disabled";
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
