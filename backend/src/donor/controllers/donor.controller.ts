import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { DonorService } from '../services/donor.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Donor Dashboard')
@Controller('donors')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get donor dashboard data' })
  async getDashboard(@Query('donorId') donorId: string) {
    // In real app, get donorId from JWT token
    return this.donorService.getDashboard(donorId);
  }

  @Get('donations')
  @ApiOperation({ summary: 'Get donor donation history' })
  async getDonations(@Query('donorId') donorId: string) {
    return this.donorService.getDonations(donorId);
  }
}
