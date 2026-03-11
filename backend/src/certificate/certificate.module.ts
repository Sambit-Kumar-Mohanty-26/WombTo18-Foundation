import { Module } from '@nestjs/common';
import { CertificateController } from './controllers/certificate.controller';
import { CertificateService } from './services/certificate.service';

@Module({
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
