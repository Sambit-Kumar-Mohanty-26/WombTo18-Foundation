import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private readonly configService;
    private transporter;
    private readonly isEmailDisabled;
    private readonly smtpUser;
    private readonly smtpFrom;
    constructor(configService: ConfigService);
    sendEmail(to: string, subject: string, html: string, text: string): Promise<void>;
    sendOtpEmail(email: string, code: string): Promise<void>;
    sendCampNotificationEmail(params: {
        email: string;
        volunteerName: string;
        campName: string;
        message: string;
        link?: string;
        selected: boolean;
    }): Promise<void>;
    sendCampReminderEmail(params: {
        email: string;
        volunteerName: string;
        campName: string;
        campDate: string;
        message: string;
        link?: string;
    }): Promise<void>;
    sendCampFollowUpEmail(params: {
        email: string;
        volunteerName: string;
        campName: string;
        campDate: string;
        message: string;
    }): Promise<void>;
    private buildCampEmail;
}
