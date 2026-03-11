import { Module } from '@nestjs/common';
import { ProgramController } from './controllers/program.controller';
import { ProgramService } from './services/program.service';

@Module({
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [ProgramService],
})
export class ProgramModule {}
