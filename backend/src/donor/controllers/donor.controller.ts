import { Controller, Get, Param, Post, UseGuards, Request, Query } from '@nestjs/common';
import { DonorService } from '../services/donor.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Donor Dashboard')
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
  @ApiOperation({ summary: 'Get top donors leaderboard' })
  async getLeaderboard() {
    return this.donorService.getLeaderboard();
  }

  @Get('recruits/:id')
  @ApiOperation({ summary: 'Get recruited supporters for a volunteer' })
  async getRecruits(@Param('id') id: string) {
    return this.donorService.getRecruits(id);
  }

  @Post('apply-volunteer')
  @ApiOperation({ summary: 'Promote donor to volunteer' })
  async becomeVolunteer(@Query('donorId') donorId: string) {
    return this.donorService.becomeVolunteer(donorId);
  }
}
