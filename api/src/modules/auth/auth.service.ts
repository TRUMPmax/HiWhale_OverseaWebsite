import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../common/prisma/prisma.service";
import type { JwtPayload } from "./jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private sign(payload: JwtPayload): string {
    return this.jwt.sign(payload, { expiresIn: "7d" });
  }

  /** 注册：邮箱格式由 DTO 校验（海外站暂不接 SMTP，无验证码环节） */
  async register(dto: { name: string; company: string; email: string; password: string }) {
    const email = dto.email.toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException("该邮箱已注册");

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        company: dto.company,
        email,
        passwordHash: await bcrypt.hash(dto.password, 10),
      },
    });
    return {
      user: { id: user.id, name: user.name, email: user.email, company: user.company },
      token: this.sign({ sub: user.id, email: user.email, kind: "user" }),
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException("邮箱或密码错误");
    }
    if (user.status !== "ACTIVE") {
      throw new UnauthorizedException("账号已被禁用，请联系客服");
    }
    return {
      user: { id: user.id, name: user.name, email: user.email, company: user.company },
      token: this.sign({ sub: user.id, email: user.email, kind: "user" }),
    };
  }

  async staffLogin(email: string, password: string) {
    const staff = await this.prisma.staffUser.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!staff || !(await bcrypt.compare(password, staff.passwordHash))) {
      throw new UnauthorizedException("邮箱或密码错误");
    }
    if (staff.status !== "ACTIVE") {
      throw new UnauthorizedException("账号已被禁用");
    }
    return {
      user: { id: staff.id, name: staff.name, email: staff.email },
      role: staff.role,
      token: this.sign({ sub: staff.id, email: staff.email, kind: "staff", role: staff.role }),
    };
  }

  async me(payload: JwtPayload) {
    if (payload.kind === "staff") {
      const staff = await this.prisma.staffUser.findUnique({ where: { id: payload.sub } });
      if (!staff) throw new UnauthorizedException("账号不存在");
      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        kind: "staff",
      };
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException("账号不存在");
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      kind: "user",
    };
  }
}
