import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly isEmailDisabled: boolean;
  private readonly smtpUser: string;
  private readonly smtpFrom: string;

  constructor(private readonly configService: ConfigService) {
    this.isEmailDisabled = this.configService.get<string>('DISABLE_EMAIL') === 'true';
    this.smtpUser = this.configService.get<string>('SMTP_USER') || '';
    this.smtpFrom = this.configService.get<string>('SMTP_FROM') || `WombTo18 Team <${this.smtpUser}>`;

    const host = this.configService.get<string>('SMTP_HOST');
    const pass = this.configService.get<string>('SMTP_PASS');
    const port = parseInt(this.configService.get<string>('SMTP_PORT') || '587');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';

    if (host && this.smtpUser && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: this.smtpUser,
          pass,
        },
      });
    }
  }

  async sendEmail(to: string, subject: string, html: string, text: string): Promise<void> {
    if (this.isEmailDisabled) {
      console.log(`[EMAIL DISABLED] To: ${to} | Subject: ${subject}`);
      return;
    }

    if (!this.transporter) {
      if (this.configService.get<string>('NODE_ENV') !== 'production') {
        console.log(`[EMAIL DEV LOG] To: ${to} | Subject: ${subject}`);
        console.log(`Text: ${text}`);
      } else {
        throw new Error('Email transporter not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS');
      }
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.smtpFrom,
        to,
        subject,
        text,
        html,
      });
      console.log(`[EMAIL SENT] To: ${to} | Subject: ${subject}`);
    } catch (error) {
      console.error('[EMAIL ERROR]', error);
      throw error;
    }
  }

  async sendOtpEmail(email: string, code: string): Promise<void> {
    const subject = 'Your WombTo18 login OTP';
    const text = `Your one-time login code is: ${code}\n\nThis code is valid for 10 minutes. Do not share it with anyone.`;
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:1.5rem;font-weight:800;color:#10b981;">WombTo18</span>
          <span style="font-size:1rem;color:#64748b;display:block;margin-top:4px;">Foundation Platform</span>
        </div>
        <div style="background:white;border-radius:10px;padding:28px;text-align:center;">
          <p style="color:#1e293b;font-size:1rem;margin-bottom:20px;">Your one-time login code:</p>
          <div style="display:inline-block;background:#ecfdf5;border:2px solid #6ee7b7;border-radius:10px;padding:16px 40px;">
            <span style="font-size:2.5rem;font-weight:800;letter-spacing:0.2em;color:#059669;">${code}</span>
          </div>
          <p style="color:#64748b;font-size:0.9rem;margin-top:20px;">Valid for <strong>10 minutes</strong>. Do not share this code.</p>
        </div>
        <p style="color:#94a3b8;font-size:0.8rem;text-align:center;margin-top:20px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await this.sendEmail(email, subject, html, text);
  }
}
