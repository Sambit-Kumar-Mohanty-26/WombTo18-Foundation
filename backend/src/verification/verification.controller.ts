import { Controller, Post, Body } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verify')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('send-otp')
  async sendMobileOtp(@Body('mobile') mobile: string) {
    if (!mobile || mobile.length < 10) {
      return { success: false, message: 'Invalid mobile number' };
    }
    return this.verificationService.sendMobileOtp(mobile);
  }

  @Post('send-email')
  async sendEmailLink(@Body('email') email: string, @Body('verifyUrl') verifyUrl: string) {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Invalid email address' };
    }
    return this.verificationService.sendEmailLink(email, verifyUrl);
  }
}
