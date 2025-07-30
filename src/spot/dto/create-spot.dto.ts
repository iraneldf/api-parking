import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpotDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^A-\d+$/, {
    message: 'El número de plaza debe seguir el formato A-1, A-21, etc.',
  })
  @ApiProperty({
    description: 'Número identificador de la plaza de parking',
    example: 'A-21',
  })
  number: string;
}
