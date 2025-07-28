import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSpotDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^A\d{2}$/, {
    message: 'El número de plaza debe seguir el formato A01, A02, etc.',
  })
  number: string;
}
