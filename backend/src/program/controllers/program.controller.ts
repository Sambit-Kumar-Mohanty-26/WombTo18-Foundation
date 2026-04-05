import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ProgramService } from '../services/program.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Programs')
@Controller('programs')
@UseInterceptors(CacheInterceptor)
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  @CacheTTL(600) // Cache for 10 minutes
  @ApiOperation({ summary: 'Get all donation programs' })
  async findAll() {
    return this.programService.findAll();
  }
}

