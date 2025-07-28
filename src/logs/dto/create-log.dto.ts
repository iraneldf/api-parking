import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLogDto {
  @IsEnum(['reserva', 'cancelacion', 'entrada', 'salida'])
  type: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  userId?: number;

  @IsOptional()
  data?: Record<string, any>;
}
