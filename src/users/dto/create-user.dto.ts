import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
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
  @IsOptional()
  name: string;

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
