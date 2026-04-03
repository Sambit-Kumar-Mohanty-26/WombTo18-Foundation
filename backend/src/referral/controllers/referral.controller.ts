import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReferralService } from '../services/referral.service';

@ApiTags('Referrals')
@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a referral when someone uses a referral link' })
  async create(@Body() body: {
    referrerType: 'VOLUNTEER' | 'PARTNER';
    referrerId: string;
    referredEmail: string;
    referredName?: string;
    referredPhone?: string;
  }) {
    return this.referralService.createReferral(body);
  }

  @Post('payment')
  @ApiOperation({ summary: 'Process a payment from a referred person' })
  async processPayment(
    @Body('referralId') referralId: string,
    @Body('paymentAmount') paymentAmount: number,
    @Body('joinedDonorId') joinedDonorId?: string,
  ) {
    return this.referralService.processReferralPayment(referralId, paymentAmount, joinedDonorId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get referral stats for a referrer' })
  async getStats(
    @Query('referrerType') referrerType: 'VOLUNTEER' | 'PARTNER',
    @Query('referrerId') referrerId: string,
  ) {
    return this.referralService.getStats(referrerType, referrerId);
  }

  @Get('by-email/:email')
  @ApiOperation({ summary: 'Find referral by referred email' })
  async findByEmail(@Param('email') email: string) {
    return this.referralService.findByReferredEmail(email);
  }
}
