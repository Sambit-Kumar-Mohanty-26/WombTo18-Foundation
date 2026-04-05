import { Controller, Get, Query, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeaderboardService } from '../services/leaderboard.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Leaderboard')
@Controller('leaderboard')
@UseInterceptors(CacheInterceptor)
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('donors')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get donor leaderboard by total donations' })
  async donorLeaderboard(@Query('limit') limit?: string) {
    return this.leaderboardService.getDonorLeaderboard(limit ? parseInt(limit) : 50);
  }

  @Get('volunteers')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get volunteer leaderboard by coins' })
  async volunteerLeaderboard(@Query('limit') limit?: string) {
    return this.leaderboardService.getVolunteerLeaderboard(limit ? parseInt(limit) : 50);
  }

  @Get('partners')
  @CacheTTL(300) // Cache for 5 minutes
  @ApiOperation({ summary: 'Get partner leaderboard by total impact' })
  async partnerLeaderboard(@Query('limit') limit?: string) {
    return this.leaderboardService.getPartnerLeaderboard(limit ? parseInt(limit) : 50);
  }

  @Get('donor-rank/:donorId')
  @CacheTTL(60) // Cache for 1 minute (user-specific)
  @ApiOperation({ summary: 'Get a specific donor rank' })
  async donorRank(@Param('donorId') donorId: string) {
    return this.leaderboardService.getDonorRank(donorId);
  }

  @Get('volunteer-rank/:volunteerId')
  @CacheTTL(60) // Cache for 1 minute (user-specific)
  @ApiOperation({ summary: 'Get a specific volunteer rank' })
  async volunteerRank(@Param('volunteerId') volunteerId: string) {
    return this.leaderboardService.getVolunteerRank(volunteerId);
  }
}

