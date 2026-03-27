import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class TranslateDto {
  @ApiProperty({
    description: 'English source strings to translate.',
    example: ['A Roadmap to Transformative Scale', 'Reporting Calendar'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  texts!: string[];

  @ApiProperty({ description: 'ISO 639-1/639-2 language code for the source language.', example: 'en' })
  @IsString()
  @Length(2, 10)
  sourceLanguage!: string;

  @ApiProperty({ description: 'ISO 639-1/639-2 language code for the target language.', example: 'ta' })
  @IsString()
  @Length(2, 10)
  targetLanguage!: string;

  @ApiProperty({
    description: 'Optional explicit Bhashini translation serviceId. When omitted, the backend resolves it from pipeline config.',
    required: false,
    example: 'ai4bharat/indictrans-fairseq-e2i-gpu--t4',
  })
  @IsOptional()
  @IsString()
  serviceId?: string;
}
