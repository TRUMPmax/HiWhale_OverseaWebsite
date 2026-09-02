import {
  BadRequestException,
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../common/prisma/prisma.service";
import { MailService } from "../mail/mail.service";
import type { JwtPayload } from "./jwt.strategy";

/** 验证码有效期：10 分钟 */
const CODE_TTL_MS = 10 * 60 * 1000;

/** 验证码发送限频：每邮箱 10 分钟最多 3 次（内存实现） */
const codeTimestamps = new Map<string, number[]>();
function throttleCode(email: string): boolean {
  const now = Date.now();
  const list = (codeTimestamps.get(email) ?? []).filter((t) => t > now - 600_000);
  if (list.length >= 3) return false;
  list.push(now);
  codeTimestamps.set(email, list);
  return true;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
  ) {}

  private sign(payload: JwtPayload): string {
    return this.jwt.sign(payload, { expiresIn: "7d" });
  }

  /** 发送邮箱验证码（Resend）；未配置 RESEND_API_KEY 时：开发环境回传 devCode，生产 503 */
  async sendCode(email: string) {
    const normalized = email.toLowerCase();
    if (!throttleCode(normalized)) {
      throw new BadRequestException("发送太频繁，请 10 分钟后再试");
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await this.prisma.emailCode.create({
      data: { email: normalized, code, expiresAt: new Date(Date.now() + CODE_TTL_MS) },
    });

    if (this.mail.isConfigured()) {
      const ok = await this.mail.sendVerificationCode(normalized, code);
      if (!ok) throw new ServiceUnavailableException("邮件发送失败，请稍后再试");
      return { sent: true };
    }
    // 开发降级：未配置邮件服务
    if (process.env.NODE_ENV === "production") {
      console.error("[auth] RESEND_API_KEY not configured in production");
      throw new ServiceUnavailableException("邮件服务暂不可用，请稍后再试");
    }
    console.log(`[auth] dev verification code for ${normalized}: ${code}`);
    return { sent: true, devCode: code };
  }

  private async verifyCode(email: string, code: string) {
    const record = await this.prisma.emailCode.findFirst({
      where: { email: email.toLowerCase(), code },
      orderBy: { createdAt: "desc" },
    });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException("验证码错误或已过期");
    }
    await this.prisma.emailCode.deleteMany({ where: { email: email.toLowerCase() } });
  }

  /** 注册：邮箱验证码 + 格式校验 */
  async register(dto: {
    name: string;
    company: string;
    email: string;
    code: string;
    password: string;
  }) {
    const email = dto.email.toLowerCase();
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException("该邮箱已注册");

    await this.verifyCode(email, dto.code);

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
