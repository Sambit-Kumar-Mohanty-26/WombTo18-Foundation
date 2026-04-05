import { Module } from '@nestjs/common';
import { BhashiniController } from './controllers/bhashini.controller';
import { BhashiniService } from './services/bhashini.service';

@Module({
  controllers: [BhashiniController],
  providers: [BhashiniService],
  exports: [BhashiniService],
})
export class BhashiniModule {}
