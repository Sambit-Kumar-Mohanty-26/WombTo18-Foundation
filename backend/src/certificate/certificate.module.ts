import { Module } from '@nestjs/common';
import { CertificateController } from './controllers/certificate.controller';
import { CertificateService } from './services/certificate.service';
import { DonationModule } from '../donation/donation.module';

@Module({
  imports: [DonationModule],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
