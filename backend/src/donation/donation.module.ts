import { Module } from '@nestjs/common';
import { DonationController } from './controllers/donation.controller';
import { DonationService } from './services/donation.service';

@Module({
  controllers: [DonationController],
  providers: [DonationService],
  exports: [DonationService],
})
export class DonationModule {}
