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
      console.log(`[EMAIL SENT SUCCESS] To: ${to} | Subject: ${subject}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[EMAIL ERROR] Failed to send email.', {
        to,
        subject,
        error: errorMessage
      });
      
      // In development, we don't want to crash the whole process if email fails
      // This allows the login flow to proceed with the devOtp or mock OTP
      if (this.configService.get<string>('NODE_ENV') === 'production') {
        throw error;
      }
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

  async sendCampNotificationEmail(params: {
    email: string;
    volunteerName: string;
    campName: string;
    message: string;
    link?: string;
    selected: boolean;
  }): Promise<void> {
    const subject = params.selected
      ? `Your camp attendance link is ready for ${params.campName}`
      : `More camps are coming soon`;

    const text = params.selected
      ? `${params.volunteerName}, your attendance link for ${params.campName} is ready.\n\n${params.message}\n${params.link ? `\nOpen link: ${params.link}` : ''}`
      : `${params.volunteerName}, you were not selected for the current camp window.\n\n${params.message}`;

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="font-size:1.6rem;font-weight:900;color:#14532d;">WombTo18</div>
          <div style="font-size:0.95rem;color:#64748b;margin-top:4px;">Camp Attendance Update</div>
        </div>
        <div style="background:white;border:1px solid #e2e8f0;border-radius:18px;padding:28px;">
          <p style="font-size:1rem;color:#0f172a;margin:0 0 12px;"><strong>${params.volunteerName}</strong></p>
          <h2 style="font-size:1.35rem;line-height:1.4;margin:0 0 16px;color:#0f172a;">${params.selected ? `Your link for ${params.campName} is ready` : 'A new camp update for you'}</h2>
          <p style="font-size:0.98rem;line-height:1.7;color:#334155;margin:0 0 20px;">${params.message}</p>
          ${params.link ? `
            <div style="text-align:center;margin:28px 0 10px;">
              <a href="${params.link}" style="display:inline-block;background:linear-gradient(90deg,#16a34a,#22c55e);color:white;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:800;">Open Attendance Link</a>
            </div>
            <p style="font-size:0.8rem;color:#64748b;text-align:center;word-break:break-all;">${params.link}</p>
          ` : ''}
        </div>
        <p style="color:#94a3b8;font-size:0.8rem;text-align:center;margin-top:20px;">If this wasn't expected, you can safely ignore this message.</p>
      </div>
    `;

    await this.sendEmail(params.email, subject, html, text);
  }
}
