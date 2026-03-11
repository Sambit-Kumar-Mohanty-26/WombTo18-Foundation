import { Module } from '@nestjs/common';
import { DonorController } from './controllers/donor.controller';
import { DonorService } from './services/donor.service';
import { TransparencyController } from './controllers/transparency.controller';

@Module({
  controllers: [DonorController, TransparencyController],
  providers: [DonorService],
  exports: [DonorService],
})
export class DonorModule {}
