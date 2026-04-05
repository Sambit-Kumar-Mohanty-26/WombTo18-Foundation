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

    const html = this.buildCampEmail({
      eyebrow: params.selected ? "Attendance ready" : "Camp update",
      title: params.selected ? `Your link for ${params.campName} is ready` : "A new camp update for you",
      volunteerName: params.volunteerName,
      campName: params.campName,
      message: params.message,
      link: params.link,
      ctaLabel: params.link ? "Open Attendance Link" : undefined,
      accent: params.selected ? "#16a34a" : "#0f766e",
    });

    await this.sendEmail(params.email, subject, html, text);
  }

  async sendCampReminderEmail(params: {
    email: string;
    volunteerName: string;
    campName: string;
    campDate: string;
    message: string;
    link?: string;
  }): Promise<void> {
    const subject = `Your camp is tomorrow: ${params.campName}`;
    const text = `${params.volunteerName}, your camp "${params.campName}" is tomorrow on ${params.campDate}.\n\n${params.message}${params.link ? `\n\nOpen camp link: ${params.link}` : ''}`;
    const html = this.buildCampEmail({
      eyebrow: "Tomorrow reminder",
      title: `Your camp is tomorrow`,
      volunteerName: params.volunteerName,
      campName: params.campName,
      message: params.message,
      link: params.link,
      ctaLabel: params.link ? "Open Camp Details" : undefined,
      accent: "#ea580c",
      metaLine: params.campDate,
    });

    await this.sendEmail(params.email, subject, html, text);
  }

  async sendCampFollowUpEmail(params: {
    email: string;
    volunteerName: string;
    campName: string;
    campDate: string;
    message: string;
  }): Promise<void> {
    const subject = `Thank you for staying in touch with ${params.campName}`;
    const text = `${params.volunteerName}, ${params.campName} has concluded on ${params.campDate}.\n\n${params.message}`;
    const html = this.buildCampEmail({
      eyebrow: "Post-camp note",
      title: `A warm note after ${params.campName}`,
      volunteerName: params.volunteerName,
      campName: params.campName,
      message: params.message,
      accent: "#7c3aed",
      metaLine: params.campDate,
    });

    await this.sendEmail(params.email, subject, html, text);
  }

  private buildCampEmail(params: {
    eyebrow: string;
    title: string;
    volunteerName: string;
    campName: string;
    message: string;
    link?: string;
    ctaLabel?: string;
    accent: string;
    metaLine?: string;
  }) {
    const safeLink = params.link && params.ctaLabel
      ? `<a href="${params.link}" style="display:inline-block;background:${params.accent};color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:800;">${params.ctaLabel}</a>`
      : '';
    return `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;background:linear-gradient(180deg,#f8fafc 0%,#eff6ff 100%);border-radius:24px;">
        <div style="padding:8px 4px 18px;text-align:center;">
          <div style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,0.8);border:1px solid rgba(148,163,184,0.2);color:#0f172a;font-weight:800;font-size:0.82rem;letter-spacing:0.08em;text-transform:uppercase;">${params.eyebrow}</div>
        </div>
        <div style="background:#ffffff;border:1px solid rgba(148,163,184,0.18);border-radius:22px;padding:28px 26px;box-shadow:0 20px 50px rgba(15,23,42,0.08);">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px;flex-wrap:wrap;">
            <div>
              <p style="margin:0 0 6px;color:#64748b;font-size:0.86rem;font-weight:700;">Hello ${params.volunteerName}</p>
              <h2 style="margin:0;color:#0f172a;font-size:1.55rem;line-height:1.25;font-weight:900;">${params.title}</h2>
            </div>
            <div style="padding:10px 14px;border-radius:16px;background:linear-gradient(135deg,rgba(16,185,129,0.12),rgba(14,165,233,0.12));color:${params.accent};font-weight:900;font-size:0.9rem;">
              ${params.campName}
            </div>
          </div>
          ${params.metaLine ? `<p style="margin:0 0 14px;color:#64748b;font-size:0.9rem;font-weight:700;">${params.metaLine}</p>` : ''}
          <p style="margin:0 0 20px;color:#334155;font-size:0.98rem;line-height:1.8;">${params.message}</p>
          ${safeLink ? `<div style="text-align:center;margin:26px 0 10px;">${safeLink}</div>` : ''}
        </div>
        <p style="margin:18px 0 0;text-align:center;color:#94a3b8;font-size:0.8rem;">WombTo18 Foundation</p>
      </div>
    `;
  }
}
