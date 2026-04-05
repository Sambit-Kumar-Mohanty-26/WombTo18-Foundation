import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ReferralService } from './services/referral.service';
import { ReferralController } from './controllers/referral.controller';
import { CoinModule } from '../coin/coin.module';

@Module({
  imports: [PrismaModule, CoinModule],
  controllers: [ReferralController],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
