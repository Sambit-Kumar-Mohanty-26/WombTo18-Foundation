import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';

/**
 * MSG91 WhatsApp Service
 *
 * Handles all outbound WhatsApp messages via the MSG91 Bulk WhatsApp API.
 * Design principles:
 *   - Fire-and-forget: All public methods catch errors internally and never throw.
 *   - Batch support: Camp reminders use the bulk to_and_components array.
 *   - Graceful degradation: If AUTH_KEY is missing, methods log a warning and return.
 */
@Injectable()
export class WhatsappService {
  private readonly authKey: string | undefined;
  private readonly integratedNumber: string | undefined;
  private readonly frontendUrl: string;
  private readonly isDisabled: boolean;

  // Template names from env (configurable)
  private readonly tplWelcomeDonor: string;
  private readonly tplWelcomeVolunteer: string;
  private readonly tplWelcomePartner: string;
  private readonly tplCampReminder: string;
  private readonly tplPartnerReferral: string;
  private readonly tplVolunteerReferral: string;

  constructor(private readonly configService: ConfigService) {
    this.authKey = this.configService.get<string>('MSG91_AUTH_KEY');
    this.integratedNumber = this.configService.get<string>('MSG91_INTEGRATED_NUMBER');
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://wombto18.org';
    this.isDisabled = this.configService.get<string>('DISABLE_WHATSAPP') === 'true';

    // Template names — update these in .env after MSG91 approves them
    this.tplWelcomeDonor = this.configService.get<string>('MSG91_TPL_WELCOME_DONOR') || 'welcome_donor';
    this.tplWelcomeVolunteer = this.configService.get<string>('MSG91_TPL_WELCOME_VOLUNTEER') || 'welcome_volunteer';
    this.tplWelcomePartner = this.configService.get<string>('MSG91_TPL_WELCOME_PARTNER') || 'welcome_partner';
    this.tplCampReminder = this.configService.get<string>('MSG91_TPL_CAMP_REMINDER') || 'camp_reminder_tomorrow';
    this.tplPartnerReferral = this.configService.get<string>('MSG91_TPL_PARTNER_REFERRAL') || 'partner_referral_notification';
    this.tplVolunteerReferral = this.configService.get<string>('MSG91_TPL_VOLUNTEER_REFERRAL') || 'volunteer_referral_notification';
  }

  // ─────────────────────────────────────────────────────
  // PRIVATE: Core HTTP + payload builder
  // ─────────────────────────────────────────────────────

  /**
   * Make an HTTPS POST request to MSG91
   */
  private makeHttpsRequest(
    url: string,
    headers: Record<string, string>,
    body: any,
  ): Promise<{ status: number; data: string }> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + (parsedUrl.search || ''),
        method: 'POST',
        headers,
      };

      const req = https.request(options, (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode || 500, data: rawData });
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(typeof body === 'string' ? body : JSON.stringify(body));
      req.end();
    });
  }

  /**
   * Normalize an Indian mobile number to format: 91XXXXXXXXXX
   */
  private normalizeMobile(mobile: string): string | null {
    if (!mobile) return null;
    const stripped = mobile.replace(/[\s\-\+]/g, '');
    // Already has country code
    if (stripped.length === 12 && stripped.startsWith('91')) return stripped;
    // 10-digit Indian number
    if (stripped.length === 10 && /^[6-9]\d{9}$/.test(stripped)) return `91${stripped}`;
    // Unknown format — log and skip
    console.warn(`[WhatsappService] Invalid mobile format, skipping: ${mobile}`);
    return null;
  }

  /**
   * Send a template message to one or more recipients via MSG91 Bulk API.
   * This is the single exit point for all MSG91 calls.
   *
   * @param templateName - MSG91-approved template name
   * @param recipients - Array of { to, components } objects
   */
  private async sendTemplate(
    templateName: string,
    recipients: Array<{
      to: string[];
      components: Record<string, { type: string; value: string; sub_type?: string }>;
    }>,
  ): Promise<void> {
    // Guard: skip if disabled or misconfigured
    if (this.isDisabled) {
      console.log(`[WhatsApp DISABLED] Template: ${templateName} | Recipients: ${recipients.length}`);
      return;
    }

    if (!this.authKey || !this.integratedNumber) {
      console.warn(
        `[WhatsApp SKIP] MSG91_AUTH_KEY or MSG91_INTEGRATED_NUMBER not set. ` +
        `Template: ${templateName} | Recipients: ${recipients.length}`,
      );
      return;
    }

    if (recipients.length === 0) return;

    const payload = {
      integrated_number: this.integratedNumber,
      content_type: 'template',
      payload: {
        messaging_product: 'whatsapp',
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en_US', policy: 'deterministic' },
          to_and_components: recipients,
        },
      },
    };

    try {
      console.log(
        `[WhatsappService] Sending template "${templateName}" to ${recipients.length} recipient(s)...`,
      );

      const response = await this.makeHttpsRequest(
        'https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/',
        {
          authkey: this.authKey,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        payload,
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(
          `[WhatsApp SENT] Template: ${templateName} | Recipients: ${recipients.length} | Status: ${response.status}`,
        );
      } else {
        console.error(
          `[WhatsApp ERROR] Template: ${templateName} | Status: ${response.status} | Response: ${response.data.substring(0, 300)}`,
        );
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[WhatsApp CRITICAL] Template: ${templateName} | Error: ${msg}`);
    }
  }

  // ─────────────────────────────────────────────────────
  // PUBLIC: Welcome Messages (fire-and-forget)
  // ─────────────────────────────────────────────────────

  /**
   * Send welcome WhatsApp to a new Donor.
   * Fire-and-forget — never throws.
   */
  sendWelcomeDonor(mobile: string, name: string): void {
    const normalized = this.normalizeMobile(mobile);
    if (!normalized) return;

    const loginUrl = `${this.frontendUrl}/login`;

    // Fire-and-forget
    this.sendTemplate(this.tplWelcomeDonor, [
      {
        to: [normalized],
        components: {
          body_1: { type: 'text', value: name },
          button_1: { type: 'text', value: loginUrl, sub_type: 'url' },
        },
      },
    ]).catch((err) =>
      console.error(`[WhatsApp] Failed welcome_donor for ${mobile}:`, err.message),
    );
  }

  /**
   * Send welcome WhatsApp to a new Volunteer.
   * Fire-and-forget — never throws.
   */
  sendWelcomeVolunteer(mobile: string, name: string): void {
    const normalized = this.normalizeMobile(mobile);
    if (!normalized) return;

    const loginUrl = `${this.frontendUrl}/login`;

    this.sendTemplate(this.tplWelcomeVolunteer, [
      {
        to: [normalized],
        components: {
          body_1: { type: 'text', value: name },
          button_1: { type: 'text', value: loginUrl, sub_type: 'url' },
        },
      },
    ]).catch((err) =>
      console.error(`[WhatsApp] Failed welcome_volunteer for ${mobile}:`, err.message),
    );
  }

  /**
   * Send welcome WhatsApp to a new Partner.
   * Fire-and-forget — never throws.
   */
  sendWelcomePartner(mobile: string, contactPerson: string): void {
    const normalized = this.normalizeMobile(mobile);
    if (!normalized) return;

    const loginUrl = `${this.frontendUrl}/partner/login`;

    this.sendTemplate(this.tplWelcomePartner, [
      {
        to: [normalized],
        components: {
          body_1: { type: 'text', value: contactPerson },
          button_1: { type: 'text', value: loginUrl, sub_type: 'url' },
        },
      },
    ]).catch((err) =>
      console.error(`[WhatsApp] Failed welcome_partner for ${mobile}:`, err.message),
    );
  }

  // ─────────────────────────────────────────────────────
  // PUBLIC: Camp Reminder (Bulk)
  // ─────────────────────────────────────────────────────

  /**
   * Send camp reminder to multiple volunteers in a single bulk API call.
   * Fire-and-forget — never throws.
   */
  sendCampReminderBulk(
    recipients: Array<{
      mobile: string;
      name: string;
      campName: string;
      campLink: string;
    }>,
  ): void {
    if (recipients.length === 0) return;

    const bulkRecipients = recipients
      .map((r) => {
        const normalized = this.normalizeMobile(r.mobile);
        if (!normalized) return null;
        return {
          to: [normalized],
          components: {
            body_1: { type: 'text', value: r.name },
            body_2: { type: 'text', value: r.campName },
            button_1: { type: 'text', value: r.campLink, sub_type: 'url' },
          },
        };
      })
      .filter(Boolean) as Array<{
      to: string[];
      components: Record<string, { type: string; value: string; sub_type?: string }>;
    }>;

    if (bulkRecipients.length === 0) return;

    console.log(
      `[WhatsappService] Preparing bulk camp reminder for ${bulkRecipients.length} volunteer(s)`,
    );

    this.sendTemplate(this.tplCampReminder, bulkRecipients).catch((err) =>
      console.error(`[WhatsApp] Failed bulk camp reminder:`, err.message),
    );
  }

  // ─────────────────────────────────────────────────────
  // PUBLIC: Referral Notifications (fire-and-forget)
  // ─────────────────────────────────────────────────────

  /**
   * Notify a Partner that someone used their referral code.
   * Fire-and-forget — never throws.
   */
  sendPartnerReferralNotification(
    mobile: string,
    contactPerson: string,
    referralCode: string,
    registrationNo: string,
  ): void {
    const normalized = this.normalizeMobile(mobile);
    if (!normalized) return;

    const loginUrl = `${this.frontendUrl}/partner/login`;

    this.sendTemplate(this.tplPartnerReferral, [
      {
        to: [normalized],
        components: {
          body_1: { type: 'text', value: contactPerson },
          body_2: { type: 'text', value: referralCode },
          body_3: { type: 'text', value: registrationNo },
          button_1: { type: 'text', value: loginUrl, sub_type: 'url' },
        },
      },
    ]).catch((err) =>
      console.error(`[WhatsApp] Failed partner_referral for ${mobile}:`, err.message),
    );
  }

  /**
   * Notify a Volunteer that someone used their referral code.
   * Fire-and-forget — never throws.
   */
  sendVolunteerReferralNotification(
    mobile: string,
    volunteerName: string,
    referralCode: string,
    registrationNo: string,
  ): void {
    const normalized = this.normalizeMobile(mobile);
    if (!normalized) return;

    const loginUrl = `${this.frontendUrl}/login`;

    this.sendTemplate(this.tplVolunteerReferral, [
      {
        to: [normalized],
        components: {
          body_1: { type: 'text', value: volunteerName },
          body_2: { type: 'text', value: referralCode },
          body_3: { type: 'text', value: registrationNo },
          button_1: { type: 'text', value: loginUrl, sub_type: 'url' },
        },
      },
    ]).catch((err) =>
      console.error(`[WhatsApp] Failed volunteer_referral for ${mobile}:`, err.message),
    );
  }
}
