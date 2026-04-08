import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CoinService } from '../services/coin.service';

@ApiTags('Coins')
@Controller('coins')
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get('config')
  @ApiOperation({ summary: 'Get coin configuration' })
  async getConfig() {
    return this.coinService.getCoinConfig();
  }

  @Post('config')
  @ApiOperation({ summary: 'Update coin configuration (admin)' })
  async updateConfig(@Body() body: any) {
    return this.coinService.updateCoinConfig(body);
  }

  @Post('first-login')
  @ApiOperation({ summary: 'Award one-time first login coins' })
  async firstLogin(@Body('volunteerId') volunteerId: string) {
    return this.coinService.awardFirstLoginCoins(volunteerId);
  }

  @Post('backfill-volunteer-welcome-bonuses')
  @ApiOperation({ summary: 'Backfill missed volunteer welcome bonus credits' })
  async backfillVolunteerWelcomeBonuses(@Body('volunteerIdentifier') volunteerIdentifier?: string) {
    return this.coinService.backfillVolunteerWelcomeBonuses(volunteerIdentifier);
  }

  @Get('balance/:volunteerId')
  @ApiOperation({ summary: 'Get coin balance and breakdown' })
  async getBalance(@Param('volunteerId') volunteerId: string) {
    return this.coinService.getBalance(volunteerId);
  }
}
