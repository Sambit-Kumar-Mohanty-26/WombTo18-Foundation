import { Controller, Get } from '@nestjs/common';
import { ProgramService } from '../services/program.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Programs')
@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  @ApiOperation({ summary: 'Get all donation programs' })
  async findAll() {
    return this.programService.findAll();
  }
}
