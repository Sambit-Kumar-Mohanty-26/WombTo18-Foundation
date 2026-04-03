import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CampService } from './services/camp.service';
import { CampController } from './controllers/camp.controller';
import { CoinModule } from '../coin/coin.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, CoinModule, AuthModule],
  controllers: [CampController],
  providers: [CampService],
  exports: [CampService],
})
export class CampModule {}
