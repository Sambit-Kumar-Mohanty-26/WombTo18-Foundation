import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VolunteerService } from '../services/volunteer.service';

@ApiTags('Volunteer')
@Controller('volunteers')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post('register')
  @ApiOperation({ summary: 'Upgrade donor to volunteer' })
  async register(
    @Body() body: {
      donorId: string;
      city?: string;
      profession?: string;
      skills?: string[];
      availability?: string;
      linkedIn?: string;
      motivation?: string;
    },
  ) {
    return this.volunteerService.registerVolunteer(body);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get volunteer dashboard data' })
  async getDashboard(@Query('volunteerId') volunteerId: string) {
    return this.volunteerService.getDashboard(volunteerId);
  }

  @Get('referrals/:volunteerId')
  @ApiOperation({ summary: 'Get all referrals for a volunteer' })
  async getReferrals(@Param('volunteerId') volunteerId: string) {
    return this.volunteerService.getReferrals(volunteerId);
  }

  @Get('coins/:volunteerId')
  @ApiOperation({ summary: 'Get coin transaction history' })
  async getCoinHistory(@Param('volunteerId') volunteerId: string) {
    return this.volunteerService.getCoinHistory(volunteerId);
  }

  @Get('camps/:volunteerId')
  @ApiOperation({ summary: 'Get camp participation history' })
  async getCampHistory(@Param('volunteerId') volunteerId: string) {
    return this.volunteerService.getCampHistory(volunteerId);
  }

  @Post('leaderboard-visibility')
  @ApiOperation({ summary: 'Toggle leaderboard visibility' })
  async toggleLeaderboard(
    @Body('volunteerId') volunteerId: string,
    @Body('show') show: boolean,
  ) {
    return this.volunteerService.toggleLeaderboard(volunteerId, show);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get volunteer leaderboard by coins' })
  async getLeaderboard(@Query('limit') limit?: string) {
    return this.volunteerService.getLeaderboard(limit ? parseInt(limit) : 50);
  }
}
