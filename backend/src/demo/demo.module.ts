import { Module } from '@nestjs/common';
import { DemoController } from './controllers/demo.controller';

@Module({
  controllers: [DemoController],
})
export class DemoModule {}
