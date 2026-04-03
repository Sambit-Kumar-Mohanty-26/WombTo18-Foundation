import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeaderboardService } from '../services/leaderboard.service';

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('donors')
  @ApiOperation({ summary: 'Get donor leaderboard by total donations' })
  async donorLeaderboard(@Query('limit') limit?: string) {
    return this.leaderboardService.getDonorLeaderboard(limit ? parseInt(limit) : 50);
  }

  @Get('volunteers')
  @ApiOperation({ summary: 'Get volunteer leaderboard by coins' })
  async volunteerLeaderboard(@Query('limit') limit?: string) {
    return this.leaderboardService.getVolunteerLeaderboard(limit ? parseInt(limit) : 50);
  }

  @Get('donor-rank/:donorId')
  @ApiOperation({ summary: 'Get a specific donor rank' })
  async donorRank(@Param('donorId') donorId: string) {
    return this.leaderboardService.getDonorRank(donorId);
  }

  @Get('volunteer-rank/:volunteerId')
  @ApiOperation({ summary: 'Get a specific volunteer rank' })
  async volunteerRank(@Param('volunteerId') volunteerId: string) {
    return this.leaderboardService.getVolunteerRank(volunteerId);
  }
}
