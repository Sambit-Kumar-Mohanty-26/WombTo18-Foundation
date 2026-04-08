import { IsArray, IsOptional, IsString, IsUrl, ArrayNotEmpty } from 'class-validator';

export class VolunteerOnboardingDto {
  @IsString()
  donorId!: string;

  @IsString()
  city!: string;

  @IsString()
  profession!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills!: string[];

  @IsString()
  availability!: string;

  @IsOptional()
  @IsUrl({}, { message: 'LinkedIn profile must be a valid URL.' })
  linkedIn?: string;

  @IsString()
  motivation!: string;
}
