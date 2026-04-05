import { Controller, Get, Post, Body, Query, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PartnerService } from '../services/partner.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@ApiTags('Partner')
@Controller('partners')
export class PartnerController {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new partner (self-signup)' })
  async signup(@Body() data: {
    organizationName: string;
    contactPerson: string;
    email: string;
    mobile: string;
    password: string;
    panNumber?: string;
    csrCategory?: string;
  }) {
    return this.partnerService.signup(data);
  }

  @Post('signup/send-email-otp')
  @ApiOperation({ summary: 'Send email OTP for signup' })
  async sendEmailOtp(@Body('email') email: string) {
    return this.partnerService.sendSignupEmailOtp(email);
  }

  @Post('signup/send-mobile-otp')
  @ApiOperation({ summary: 'Send mobile OTP for signup' })
  async sendMobileOtp(@Body('mobile') mobile: string) {
    return this.partnerService.sendSignupMobileOtp(mobile);
  }

  @Post('signup/verify-otp')
  @ApiOperation({ summary: 'Verify OTP (email or mobile)' })
  async verifyOtp(@Body() data: { 
    type: 'email' | 'mobile', 
    hash: string, 
    otp: string 
  }) {
    return this.partnerService.verifySignupOtp(data.type, data.hash, data.otp);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create partner account (admin only)' })
  async create(@Body() body: {
    organizationName: string;
    contactPerson: string;
    email: string;
    mobile?: string;
    password: string;
    panNumber?: string;
    csrCategory?: string;
  }) {
    return this.partnerService.createPartner(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Partner login with email/password' })
  async login(
    @Body('email') email: string, 
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: any = await this.partnerService.login(email, password);
    
    if (result.success && result.partnerId) {
      const payload = { sub: result.partnerId, email, role: 'PARTNER' };
      const token = this.jwtService.sign(payload);

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return {
        ...result,
        token,
        redirect: `/partner/${result.partnerId}/dashboard`
      };
    }
    return result;
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get partner dashboard' })
  async getDashboard(@Query('partnerId') partnerId: string) {
    return this.partnerService.getDashboard(partnerId);
  }

  @Get('referrals/:partnerId')
  @ApiOperation({ summary: 'Get partner referrals' })
  async getReferrals(@Param('partnerId') partnerId: string) {
    return this.partnerService.getReferrals(partnerId);
  }

  @Get('list')
  @ApiOperation({ summary: 'List all partners (admin)' })
  async listAll() {
    return this.partnerService.listAll();
  }
}
