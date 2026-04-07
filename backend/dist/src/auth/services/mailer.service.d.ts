import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private readonly configService;
    private readonly isEmailDisabled;
    constructor(configService: ConfigService);
    private makeHttpsRequest;
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
    sendWelcomeDonorEmail(params: {
        email: string;
        name: string;
        donorId: string;
    }): Promise<void>;
    sendWelcomeVolunteerEmail(params: {
        email: string;
        name: string;
        donorId: string;
        volunteerId?: string;
    }): Promise<void>;
    sendWelcomePartnerEmail(params: {
        email: string;
        contactPerson: string;
        organizationName: string;
        partnerId: string;
    }): Promise<void>;
    private buildWelcomeEmail;
}
