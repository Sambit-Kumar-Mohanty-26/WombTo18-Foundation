import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CoinService } from './services/coin.service';
import { CoinController } from './controllers/coin.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CoinController],
  providers: [CoinService],
  exports: [CoinService],
})
export class CoinModule {}
