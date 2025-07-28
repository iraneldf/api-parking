import { IsOptional, IsEnum, IsDateString } from 'class-validator';

export class FilterLogsDto {
  @IsOptional()
  @IsEnum(['reserva', 'cancelacion', 'entrada', 'salida'])
  type?: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
