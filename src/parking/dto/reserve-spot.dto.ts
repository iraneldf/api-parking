import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { IReserveSpot } from '../interfaces/reverve-spot.interface';

export class ReserveSpotDto implements IReserveSpot {
  @ApiProperty({
    description: 'Matrícula del vehículo',
    example: 'ABC123',
  })
  @IsString()
  vehicle: string;

  @ApiProperty({
    description: 'Fecha y hora de la reserva',
    example: '2025-08-10T15:00:00Z',
    type: String,
  })
  @IsDate()
  @Type(() => Date)
  reservedAt: Date;

  @ApiProperty({
    description: 'Duración de la reserva en minutos',
    example: 60,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  duration: number;
}
