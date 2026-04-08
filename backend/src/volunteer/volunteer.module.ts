import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VolunteerService } from './services/volunteer.service';
import { VolunteerController } from './controllers/volunteer.controller';
import { CoinModule } from '../coin/coin.module';

@Module({
  imports: [PrismaModule, CoinModule],
  controllers: [VolunteerController],
  providers: [VolunteerService],
  exports: [VolunteerService],
})
export class VolunteerModule {}
