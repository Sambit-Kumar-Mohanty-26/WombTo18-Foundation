import { PartialType } from '@nestjs/swagger';
import { CreateAdvisoryDto } from './create-advisory.dto';

export class UpdateAdvisoryDto extends PartialType(CreateAdvisoryDto) {}
