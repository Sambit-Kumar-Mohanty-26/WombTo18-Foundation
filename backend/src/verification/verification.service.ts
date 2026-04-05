import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';

@Injectable()
export class VerificationService {
  constructor(private configService: ConfigService) {}

  private makeHttpsRequest(url: string, method: string, headers: any, body?: any): Promise<{status: number, data: string}> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: method,
        headers: headers,
      };

      const req = https.request(options, (res) => {
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          resolve({ status: res.statusCode || 500, data: rawData });
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      if (body) {
        req.write(typeof body === 'string' ? body : JSON.stringify(body));
      }
      req.end();
    });
  }

  async sendMobileOtp(mobile: string, customOtp?: string): Promise<any> {
    const apiKey = this.configService.get<string>('FAST2SMS_API_KEY');
    const senderId = this.configService.get<string>('FAST2SMS_SENDER_ID');
    const messageId = this.configService.get<string>('FAST2SMS_OTP_MESSAGE_ID');

    if (!apiKey) {
      console.warn("FAST2SMS_API_KEY is not set. Simulating OTP.");
      return { success: true, message: "Mock OTP sent successfully due to missing API key." };
    }

    try {
      // Normalize mobile: strip +, spaces, dashes, then remove country code 91 only if number > 10 digits
      const stripped = mobile.replace(/[\s\-\+]/g, '');
      const cleanMobile = stripped.length > 10 && stripped.startsWith('91') ? stripped.substring(2) : stripped;

      const otp = customOtp || Math.floor(1000 + Math.random() * 9000).toString();

      // DLT Route
      // Uses TRAI-registered DLT template. The message text is pre-approved;
      // we only pass OTP as a variable. Fast2SMS fills {#var#} in the template.
      // Template format (ID 173130): "Your OTP is {#var#} ..." (registered under sender OTAAT)
      const payload = {
        route: "dlt",
        sender_id: senderId || "OTAAT",
        message: messageId || "173130",
        variables_values: otp,
        flash: 0,
        numbers: cleanMobile,
      };

      console.log(`Sending OTP ${otp} to ${cleanMobile} via Fast2SMS DLT route (sender: ${payload.sender_id}, template: ${payload.message})...`);

      const response = await this.makeHttpsRequest('https://www.fast2sms.com/dev/bulkV2', 'POST', {
        'authorization': apiKey,
        'Content-Type': 'application/json',
      }, payload);

      console.log('Fast2SMS Raw Response:', response.data);

      try {
        const data = JSON.parse(response.data);
        if (data.return === true) {
          console.log('OTP sent successfully via Fast2SMS DLT route');
          return { success: true, message: "OTP sent successfully", otp };
        }

        // Handle common Fast2SMS error codes
        if (data.status_code === 996 || data.status_code === 995 || data.status_code === 411) {
          console.warn(`Fast2SMS DLT Error (${data.status_code}): ${data.message}`);
          // In dev mode, return the OTP so testing can continue
          if (this.configService.get<string>('DEBUG_OTP') === 'true') {
            console.warn('DEBUG_OTP=true → returning OTP for development.');
            return { success: true, message: "Mock OTP (DLT template issue, debug mode).", otp };
          }
          throw new HttpException(
            `SMS delivery failed: ${data.message || 'DLT template or sender ID issue'}`,
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }

        console.error('Fast2SMS rejected:', data);
        throw new HttpException(data.message || 'Fast2SMS rejected request', HttpStatus.BAD_REQUEST);
      } catch (parseErr) {
        if (parseErr instanceof HttpException) throw parseErr;
        throw new HttpException('Fast2SMS invalid response: ' + response.data, HttpStatus.BAD_REQUEST);
      }

      } catch (error: any) {
      if (error instanceof HttpException) throw error;
      console.error("Fast2SMS Critical Error:", error);
      throw new HttpException('Failed to communicate with Fast2SMS API: ' + (error.message || error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendEmailOtp(email: string, otp: string): Promise<any> {
    const serviceId = this.configService.get<string>('EMAILJS_SERVICE_ID');
    const templateId = this.configService.get<string>('EMAILJS_TEMPLATE_ID');
    const publicKey = this.configService.get<string>('EMAILJS_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('EMAILJS_PRIVATE_KEY');

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EMAILJS keys are missing. Simulating email OTP dispatch.");
      return { success: true, message: "Mock Email OTP sent successfully due to missing API keys.", otp };
    }

    try {
      const response = await this.makeHttpsRequest('https://api.emailjs.com/api/v1.0/email/send', 'POST', {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }, {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: email,
          to_name: "Partner Applicant",
          from_name: "WOMBTO18 Foundation",
          subject: "Your Email Verification Code",
          message: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 12px; background: linear-gradient(to bottom, #f0f9ff, #ffffff);">
                      <h2 style="color: #0369a1; text-align: center;">Verification Code</h2>
                      <p>Thank you for partnering with WOMBTO18 Foundation. Use the code below to verify your email address:</p>
                      <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0369a1; text-align: center; padding: 20px; background: #fff; border-radius: 8px; border: 1px dashed #0369a1; margin: 20px 0;">
                        ${otp}
                      </div>
                      <p style="font-size: 11px; color: #888; text-align: center; margin-top: 30px;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
                    </div>`,
          reply_to: "no-reply@wombto18.org",
        }
      });

      if (response.status === 200 || response.status === 201) {
        return { success: true, message: "Email OTP sent successfully", otp };
      }
      
      console.error('EmailJS Error:', response.data);
      throw new HttpException('EmailJS rejected request: ' + response.data, HttpStatus.BAD_REQUEST);
    } catch (error: any) {
      console.error("EmailJS Critical Error:", error);
      throw new HttpException('Failed to communicate with EmailJS API: ' + (error.message || error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendEmailLink(email: string, verifyUrl: string): Promise<any> {
    const serviceId = this.configService.get<string>('EMAILJS_SERVICE_ID');
    const templateId = this.configService.get<string>('EMAILJS_TEMPLATE_ID');
    const publicKey = this.configService.get<string>('EMAILJS_PUBLIC_KEY');
    const privateKey = this.configService.get<string>('EMAILJS_PRIVATE_KEY');

    if (!serviceId || !templateId || !publicKey) {
      console.warn("EMAILJS keys are missing. Simulating email link dispatch.");
      return { success: true, message: "Mock Email sent successfully due to missing API keys." };
    }

    try {
      const response = await this.makeHttpsRequest('https://api.emailjs.com/api/v1.0/email/send', 'POST', {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }, {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          to_email: email,
          to_name: "Advisory Board Applicant",
          from_name: "WOMBTO18 Advisory Board",
          subject: "Verify Your Email - Advisory Board Application",
          message: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                      <h2 style="color: #2F4F4F;">Email Verification Required</h2>
                      <p>Thank you for starting your Advisory Board application.</p>
                      <p>Please click the secure button below to verify your email address and continue with the process:</p>
                      <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2F4F4F; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Verify My Email</a>
                      <p style="font-size: 11px; color: #888; margin-top: 30px;">If you did not request this, please ignore this email.</p>
                    </div>`,
          reply_to: "no-reply@wombto18.org",
        }
      });

      if (response.status === 200 || response.status === 201) {
        return { success: true, message: "Email sent successfully via EmailJS REST API" };
      }
      
      console.error('EmailJS Error:', response.data);
      throw new HttpException('EmailJS rejected request: ' + response.data, HttpStatus.BAD_REQUEST);
    } catch (error: any) {
      console.error("EmailJS Critical Error:", error);
      throw new HttpException('Failed to communicate with EmailJS API: ' + (error.message || error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
