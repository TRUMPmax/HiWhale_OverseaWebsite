import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser, JwtAuthGuard } from "../auth/jwt-auth.guard";
import type { JwtPayload } from "../auth/jwt.strategy";
import { ListUsersDto, UpdateProfileDto, UpdateUserStatusDto } from "./dto/users.dto";
import { UsersService } from "./users.service";

function requireStaff(payload: JwtPayload) {
  if (payload.kind !== "staff") throw new ForbiddenException("仅后台员工可操作");
}

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  // ---- 门户用户：自己的资料（声明在 :id 之前） ----
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@CurrentUser() payload: JwtPayload) {
    if (payload.kind !== "user") throw new ForbiddenException("仅门户用户可访问");
    return this.users.me(payload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("me")
  updateMe(@CurrentUser() payload: JwtPayload, @Body() dto: UpdateProfileDto) {
    if (payload.kind !== "user") throw new ForbiddenException("仅门户用户可访问");
    return this.users.updateMe(payload.sub, dto);
  }

  // ---- 员工接口 ----
  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() payload: JwtPayload, @Query() query: ListUsersDto) {
    requireStaff(payload);
    return this.users.list(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get("stats/summary")
  stats(@CurrentUser() payload: JwtPayload) {
    requireStaff(payload);
    return this.users.stats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  detail(@CurrentUser() payload: JwtPayload, @Param("id") id: string) {
    requireStaff(payload);
    return this.users.detail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  setStatus(
    @CurrentUser() payload: JwtPayload,
    @Param("id") id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    requireStaff(payload);
    return this.users.setStatus(id, dto.status);
  }
}
