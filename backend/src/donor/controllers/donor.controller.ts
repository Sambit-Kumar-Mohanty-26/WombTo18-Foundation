import { Controller, Get, Post, Query, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DonorService } from '../services/donor.service';

@ApiTags('Donors')
@Controller('donors')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get donor dashboard data' })
  async getDashboard(@Query('donorId') donorId: string) {
    return this.donorService.getDashboard(donorId);
  }

  @Get('donations')
  @ApiOperation({ summary: 'Get donor donation history' })
  async getDonations(@Query('donorId') donorId: string) {
    return this.donorService.getDonations(donorId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get global donor leaderboard' })
  async getLeaderboard() {
    return this.donorService.getLeaderboard();
  }

  @Get('recruits/:donorId')
  @ApiOperation({ summary: 'Get recruits for volunteer donor' })
  async getRecruits(@Param('donorId') donorId: string) {
    return this.donorService.getRecruits(donorId);
  }

  @Post('apply-volunteer')
  @ApiOperation({ summary: 'Mark donor as volunteer' })
  async becomeVolunteer(@Query('donorId') donorId: string) {
    return this.donorService.becomeVolunteer(donorId);
  }

  @Post('toggle-leaderboard')
  @ApiOperation({ summary: 'Toggle leaderboard visibility' })
  async toggleLeaderboard(
    @Body('donorId') donorId: string,
    @Body('show') show: boolean,
  ) {
    return this.donorService.toggleLeaderboard(donorId, show);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get donor profile' })
  async getProfile(@Query('donorId') donorId: string) {
    return this.donorService.getProfile(donorId);
  }

  @Get('lookup')
  @ApiOperation({ summary: 'Look up donor by email (for guest flow)' })
  async lookup(@Query('email') email: string) {
    return this.donorService.lookupByEmail(email);
  }
}
