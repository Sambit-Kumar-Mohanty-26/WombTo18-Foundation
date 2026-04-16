import { Module } from '@nestjs/common';
import { AdvisoryService } from './advisory.service';
import { AdvisoryController } from './advisory.controller';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [VerificationModule],
  controllers: [AdvisoryController],
  providers: [AdvisoryService],
})
export class AdvisoryModule {}
