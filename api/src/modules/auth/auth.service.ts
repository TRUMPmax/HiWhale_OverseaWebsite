import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import * as nodemailer from "nodemailer";
import { PrismaService } from "../../common/prisma/prisma.service";
import type { JwtPayload } from "./jwt.strategy";

/** 验证码有效期：10 分钟 */
const CODE_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private sign(payload: JwtPayload): string {
    return this.jwt.sign(payload, { expiresIn: "7d" });
  }

  /** 发送邮箱验证码：无 SMTP 配置时走演示模式（控制台打印 + 响应回传 devCode） */
  async sendCode(email: string) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await this.prisma.emailCode.create({
      data: {
        email: email.toLowerCase(),
        code,
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
    });

    if (process.env.SMTP_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: Number(process.env.SMTP_PORT ?? 587) === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
          : undefined,
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? "noreply@hiwhale.com",
        to: email,
        subject: "HiWhale Robotics 验证码 / Verification Code",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;padding:24px">
          <h2 style="color:#0A2540;margin:0 0 8px">HiWhale Robotics</h2>
          <p style="color:#475569">您的验证码（10 分钟内有效）/ Your verification code (valid for 10 minutes):</p>
          <p style="font-size:32px;font-weight:bold;color:#1A56DB;letter-spacing:6px">${code}</p>
        </div>`,
      });
      return { sent: true };
    }

    // 演示模式：未配置 SMTP
    console.log(`[auth] dev verification code for ${email}: ${code}`);
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
