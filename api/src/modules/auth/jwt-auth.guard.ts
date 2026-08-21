import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { JwtPayload } from "./jwt.strategy";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest<T>(err: unknown, user: T | false): T {
    if (err || !user) throw new UnauthorizedException("未登录或登录已过期");
    return user;
  }
}

/** 从请求中取出当前登录用户（JWT payload） */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);
