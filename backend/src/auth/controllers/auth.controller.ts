import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Authentication')
@Controller('donor')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Identify donor and check eligibility' })
  async login(
    @Body('email') email: string,
    @Body('password') password?: string,
    @Body('isVolunteer') isVolunteer?: boolean,
    @Body('isNonDonor') isNonDonor?: boolean,
    @Body('name') name?: string,
    @Body('mobile') mobile?: string,
  ) {
    const flags = { isVolunteer, isNonDonor, name, mobile, password };
    return this.authService.donorLogin(email, flags);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP and issue JWT' })
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyOtp(email, otp);
    
    // Set JWT in HTTP-only cookie
    res.cookie('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return result;
  }
}
