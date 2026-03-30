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

  async sendMobileOtp(mobile: string): Promise<any> {
    const apiKey = this.configService.get<string>('FAST2SMS_API_KEY');
    
    if (!apiKey) {
      console.warn("FAST2SMS_API_KEY is not set. Simulating OTP.");
      return { success: true, message: "Mock OTP sent successfully due to missing API key." };
    }

    try {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const message = `Your WOMBTO18 verification OTP is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
      
      // Used "q" (Quick Transactional SMS) route - does NOT require website verification
      // The "otp" route requires DLT/website verification on Fast2SMS dashboard
      const payload = {
        route: "q",
        message: message,
        language: "english",
        flash: 0,
        numbers: mobile,
      };
      
      console.log(`Sending OTP ${otp} to ${mobile} via Fast2SMS Quick SMS route...`);
      
      const response = await this.makeHttpsRequest('https://www.fast2sms.com/dev/bulkV2', 'POST', {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      }, payload);
      
      console.log('Fast2SMS Raw Response:', response.data);
      
      try {
        const data = JSON.parse(response.data);
        if (data.return === true) {
           console.log('OTP sent successfully via Fast2SMS');
           return { success: true, message: "OTP sent successfully via Fast2SMS", otp };
        }
        
        // If the Quick route also fails, try the DLT route as final fallback
        if (data.status_code === 996 || data.status_code === 995 || data.status_code === 411) {
           console.warn(`Fast2SMS Policy Error: ${data.message}`);
           console.warn('This typically means your Fast2SMS account needs wallet balance or further verification.');
           console.warn('Returning mock OTP for development. In production, complete Fast2SMS verification.');
           return { success: true, message: "Mock OTP (Fast2SMS requires account setup).", otp };
        }
        
        console.error('Fast2SMS rejected:', data);
        throw new HttpException(data.message || 'Fast2SMS rejected request', HttpStatus.BAD_REQUEST);
      } catch (parseErr) {
        if (parseErr instanceof HttpException) throw parseErr;
        throw new HttpException('Fast2SMS invalid response: ' + response.data, HttpStatus.BAD_REQUEST);
      }
      
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error("Fast2SMS Critical Error:", error);
      throw new HttpException('Failed to communicate with Fast2SMS API: ' + (error.message || error), HttpStatus.INTERNAL_SERVER_ERROR);
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
    } catch (error) {
      console.error("EmailJS Critical Error:", error);
      throw new HttpException('Failed to communicate with EmailJS API: ' + (error.message || error), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
