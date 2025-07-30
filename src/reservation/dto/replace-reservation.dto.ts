import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReplaceReservationDto {
  @ApiPropertyOptional({
    description: 'Matrícula del vehículo',
    example: 'ABC123',
  })
  @IsOptional()
  @IsString()
  vehicle?: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora de la reserva (UTC)',
    example: '2025-08-10T15:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  reservedAt?: Date;

  @ApiPropertyOptional({
    description: 'Duración de la reserva en minutos',
    example: 60,
    minimum: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(10, { message: 'La duración mínima es de 10 minutos' })
  duration?: number;

  @ApiPropertyOptional({
    description: 'Hora real de llegada del vehículo (UTC)',
    example: '2025-08-10T15:05:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  actualArrival?: Date;

  @ApiPropertyOptional({
    description: 'Hora real de salida del vehículo (UTC)',
    example: '2025-08-10T16:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  actualDeparture?: Date;
}
