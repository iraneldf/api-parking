import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReplaceParkingSpotDto {
  @ApiPropertyOptional({
    description: 'Número identificador de la plaza de parking',
    example: 'A-21',
  })
  @IsOptional()
  @IsString()
  number?: string;
}
