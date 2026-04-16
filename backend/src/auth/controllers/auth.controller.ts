import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @ApiOperation({ summary: 'Super Admin login with env-stored credentials, no OTP' })
  async adminLogin(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!email || !password) {
      return { error: 'Email and password are required.' };
    }
    const result = await this.authService.adminLogin(email, password);

    if (result.token) {
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    return result;
  }

  @Post('donor/login')
  @ApiOperation({ summary: 'Login existing donor with password + OTP 2FA' })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!email || !password) {
      return { error: 'Email and password are required.' };
    }

    // Intercept admin credentials to redirect super admins
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const result = await this.authService.adminLogin(email, password);
      if (result.token) {
        res.cookie('auth_token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000,
        });
      }
      return {
        ...result,
        role: 'ADMIN',
        redirect: '/admin'
      };
    }

    const result = await this.authService.donorLogin(email, { password });

    if (result.token) {
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    }

    return result;
  }

  @Post('donor/register')
  @ApiOperation({ summary: 'Register a new donor account' })
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
    @Body('mobile') mobile?: string,
    @Body('isVolunteer') isVolunteer?: boolean,
    @Body('isNonDonor') isNonDonor?: boolean,
    @Body('referredById') referredById?: string,
  ) {
    if (!email || !password || !name) {
      return { error: 'Email, password, and name are required.' };
    }
    return this.authService.donorRegister({
      email,
      password,
      name,
      mobile,
      isVolunteer,
      isNonDonor,
      referredById,
    });
  }

  @Post('donor/verify-otp')
  @ApiOperation({ summary: 'Verify OTP and issue JWT' })
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!email || !otp) {
      return { error: 'Email and OTP are required.' };
    }

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

  @Post('donor/resend-otp')
  @ApiOperation({ summary: 'Resend OTP to email' })
  async resendOtp(
    @Body('email') email: string,
  ) {
    if (!email) {
      return { error: 'Email is required.' };
    }
    return this.authService.resendOtp(email);
  }

  @Post('auth/verify-dual-otp')
  @ApiOperation({ summary: 'Verify Dual OTP (Email + Mobile) across all user types' })
  async verifyDualOtp(
    @Body('email') email: string,
    @Body('emailOtp') emailOtp: string,
    @Body('mobileOtp') mobileOtp: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!email || !emailOtp) {
      return { error: 'Email and Email OTP are required.' };
    }

    const result = await this.authService.verifyDualOtp(email, emailOtp, mobileOtp);

    if (result.success && result.token) {
      res.cookie('auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }

    return result;
  }


  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Request a secure password reset link' })
  async forgotPassword(
    @Body('email') email: string,
    @Body('type') type: 'DONOR' | 'PARTNER' | 'VOLUNTEER',
  ) {
    if (!email || !type) {
      return { error: 'Email and user type are required.' };
    }
    return this.authService.forgotPassword(email, type);
  }

  @Post('auth/reset-password')
  @ApiOperation({ summary: 'Reset password using a secure link token' })
  async resetPassword(
    @Body('email') email: string,
    @Body('token') token: string,
    @Body('type') type: 'DONOR' | 'PARTNER' | 'VOLUNTEER',
    @Body('newPassword') newPassword: string,
  ) {
    if (!email || !token || !type || !newPassword) {
      return { error: 'All fields are required.' };
    }
    return this.authService.resetPassword({ email, token, type, newPassword });
  }

  @Post('donor/toggle-2fa')
  @ApiOperation({ summary: 'Toggle 2FA for donor' })
  async toggle2FA(
    @Body('donorId') donorId: string,
    @Body('enabled') enabled: boolean,
  ) {
    return this.authService.toggleTwoFactor(donorId, enabled);
  }

  @Post('auth/revoke-sessions')
  @ApiOperation({ summary: 'Revoke all other sessions' })
  async revokeSessions(@Body('donorId') donorId: string) {
    return this.authService.revokeOtherSessions(donorId);
  }
}
