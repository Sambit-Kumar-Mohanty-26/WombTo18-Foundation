import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TranslateDto } from '../dto/translate.dto';
import { BhashiniService } from '../services/bhashini.service';

@ApiTags('Bhashini')
@Controller('bhashini')
export class BhashiniController {
  constructor(private readonly bhashiniService: BhashiniService) {}

  @Post('translate')
  @ApiOperation({ summary: 'Translate a batch of strings through Bhashini' })
  async translate(@Body() dto: TranslateDto) {
    return this.bhashiniService.translate(dto);
  }
}
