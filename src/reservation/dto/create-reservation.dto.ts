import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty({ example: 'ABC123' })
  @IsString()
  vehicle: string;

  @ApiProperty({ example: '2025-08-01T15:00:00Z' })
  @IsDate()
  @Type(() => Date)
  reservedAt: Date;

  @ApiProperty({ example: 60, minimum: 10 })
  @IsNumber()
  @Min(10, { message: 'La duración mínima es de 10 minutos' })
  duration: number;
}
