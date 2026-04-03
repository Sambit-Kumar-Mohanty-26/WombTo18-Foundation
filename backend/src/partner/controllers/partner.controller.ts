import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PartnerService } from '../services/partner.service';

@ApiTags('Partner')
@Controller('partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

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
  ) {
    return this.partnerService.login(email, password);
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
