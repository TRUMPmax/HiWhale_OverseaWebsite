import { Injectable } from "@nestjs/common";

/** 邮件服务（Resend HTTP API；未配置 RESEND_API_KEY 时 isConfigured=false，调用方走开发降级） */
@Injectable()
export class MailService {
  private get apiKey() {
    return process.env.RESEND_API_KEY;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /** 通用发信。失败（含未配置）返回 false，不 throw——发信故障不阻断主流程 */
  async send(opts: { to: string | string[]; subject: string; html: string }): Promise<boolean> {
    if (!this.apiKey) return false;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.MAIL_FROM ?? "HiWhale Robotics <onboarding@resend.dev>",
          to: opts.to,
          subject: opts.subject,
          html: opts.html,
        }),
      });
      if (!res.ok) {
        console.error("[mail] resend error:", res.status, await res.text().catch(() => ""));
        return false;
      }
      return true;
    } catch (e) {
      console.error("[mail] send failed:", e);
      return false;
    }
  }

  /** 注册验证码邮件（中英双语模板） */
  sendVerificationCode(to: string, code: string): Promise<boolean> {
    return this.send({
      to,
      subject: "HiWhale Robotics Verification Code / 验证码",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;padding:24px">
        <h2 style="color:#0A2540;margin:0 0 8px">HiWhale Robotics</h2>
        <p style="color:#475569">Your verification code (valid for 10 minutes) / 您的验证码（10 分钟内有效）:</p>
        <p style="font-size:32px;font-weight:bold;color:#1A56DB;letter-spacing:6px">${code}</p>
        <p style="color:#94a3b8;font-size:12px;margin-top:16px">If you did not request this, please ignore this email. / 若非本人操作请忽略。</p>
      </div>`,
    });
  }
}
