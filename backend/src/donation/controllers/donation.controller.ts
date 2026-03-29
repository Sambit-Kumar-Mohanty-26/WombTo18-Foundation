import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { DonationService } from '../services/donation.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Donations')
@Controller('donations')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create Razorpay order for donation' })
  async create(@Body() body: any) {
    return this.donationService.createOrder(body);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify Razorpay payment signature' })
  async verify(@Body() body: any) {
    return this.donationService.verifyPayment(body);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get live donation stats and recent donors' })
  async getStats() {
    return this.donationService.getSidebarStats();
  }
}
