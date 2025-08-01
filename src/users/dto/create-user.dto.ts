import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { CreateUserInput } from 'src/users/interfaces/user.interface';

export class CreateUserDto implements CreateUserInput {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @ApiProperty({
    example: 'MiContraseña123',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario',
    required: true,
  })
  @IsString()
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  name: string;

  @ApiProperty({
    example: '53875634',
    description: 'Número telefónico del usuario',
    required: true,
  })
  @IsString()
  @Matches(/^\d{7,15}$/, {
    message:
      'El número debe contener solo dígitos y tener entre 7 y 15 caracteres',
  })
  number: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: Role,
    enumName: 'Role',
    example: Role.CLIENTE,
    required: true,
  })
  @IsOptional()
  @IsEnum(Role, {
    message: 'El rol debe ser uno válido: admin, empleado o cliente',
  })
  role: Role = Role.CLIENTE;
}
