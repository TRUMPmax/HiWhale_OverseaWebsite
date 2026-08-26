import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto, StaffLoginDto } from "./dto/auth.dto";
import { CurrentUser, JwtAuthGuard } from "./jwt-auth.guard";
import type { JwtPayload } from "./jwt.strategy";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post("staff/login")
  staffLogin(@Body() dto: StaffLoginDto) {
    return this.auth.staffLogin(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() payload: JwtPayload) {
    return this.auth.me(payload);
  }
}
