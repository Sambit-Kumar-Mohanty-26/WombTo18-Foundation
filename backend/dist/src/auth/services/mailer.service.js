"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("@nestjs/config");
let MailerService = class MailerService {
    configService;
    transporter = null;
    isEmailDisabled;
    smtpUser;
    smtpFrom;
    constructor(configService) {
        this.configService = configService;
        this.isEmailDisabled = this.configService.get('DISABLE_EMAIL') === 'true';
        this.smtpUser = this.configService.get('SMTP_USER') || '';
        this.smtpFrom = this.configService.get('SMTP_FROM') || `WombTo18 Team <${this.smtpUser}>`;
        const host = this.configService.get('SMTP_HOST');
        const pass = this.configService.get('SMTP_PASS');
        const port = parseInt(this.configService.get('SMTP_PORT') || '587');
        const secure = this.configService.get('SMTP_SECURE') === 'true';
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
    async sendEmail(to, subject, html, text) {
        if (this.isEmailDisabled) {
            console.log(`[EMAIL DISABLED] To: ${to} | Subject: ${subject}`);
            return;
        }
        if (!this.transporter) {
            if (this.configService.get('NODE_ENV') !== 'production') {
                console.log(`[EMAIL DEV LOG] To: ${to} | Subject: ${subject}`);
                console.log(`Text: ${text}`);
            }
            else {
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
        }
        catch (error) {
            console.error('[EMAIL ERROR] Failed to send email.', {
                to,
                subject,
                error: error.message
            });
            if (this.configService.get('NODE_ENV') === 'production') {
                throw error;
            }
        }
    }
    async sendOtpEmail(email, code) {
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
};
exports.MailerService = MailerService;
exports.MailerService = MailerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailerService);
//# sourceMappingURL=mailer.service.js.map