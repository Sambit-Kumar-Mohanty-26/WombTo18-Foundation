import { Controller, Get, Post, Put, Body, Query, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VolunteerService } from '../services/volunteer.service';
import { VolunteerOnboardingDto } from '../dto/volunteer-onboarding.dto';

@ApiTags('Volunteer')
@Controller('volunteers')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post('register')
  @ApiOperation({ summary: 'Upgrade donor to volunteer' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(
    @Body() body: VolunteerOnboardingDto,
  ) {
    return this.volunteerService.registerVolunteer(body);
  }

  @Post('onboard')
  @ApiOperation({ summary: 'Complete donor to volunteer onboarding' })
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async onboard(@Body() body: VolunteerOnboardingDto) {
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

  @Get('impact-history/:volunteerId')
  @ApiOperation({ summary: 'Get 6-month impact growth trend' })
  async getImpactHistory(@Param('volunteerId') volunteerId: string) {
    return this.volunteerService.getImpactHistory(volunteerId);
  }

  @Post('profile/:volunteerId')
  @ApiOperation({ summary: 'Update volunteer profile' })
  async updateProfile(
    @Param('volunteerId') volunteerId: string,
    @Body() body: any,
  ) {
    return this.volunteerService.updateProfile(volunteerId, body);
  }
  
  @Get('commissions/:volunteerId')
  @ApiOperation({ summary: 'Get volunteer commission and withdrawal data' })
  async getCommissions(@Param('volunteerId') volunteerId: string) {
    return this.volunteerService.getCommissionsData(volunteerId);
  }

  @Put('bank-details/:volunteerId')
  @ApiOperation({ summary: 'Update volunteer bank details' })
  async updateBankDetails(
    @Param('volunteerId') volunteerId: string,
    @Body() body: any,
  ) {
    return this.volunteerService.updateBankDetails(volunteerId, body);
  }

  @Post('withdraw/:volunteerId')
  @ApiOperation({ summary: 'Request withdrawal of eligible coins' })
  async requestWithdrawal(@Param('volunteerId') volunteerId: string) {
    return this.volunteerService.requestWithdrawal(volunteerId);
  }
}
