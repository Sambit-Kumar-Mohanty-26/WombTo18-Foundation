import { Module } from '@nestjs/common';
import { DonationController } from './controllers/donation.controller';
import { DonationService } from './services/donation.service';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { CoinModule } from '../coin/coin.module';

@Module({
  imports: [CoinModule],
  controllers: [DonationController],
  providers: [DonationService, PdfGeneratorService],
  exports: [DonationService],
})
export class DonationModule {}
