import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, Length, IsEnum } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Abc123456',
    required: false,
    minLength: 8,
  })
  @IsOptional()
  @Length(8, 30, {
    message: 'La contraseña debe tener entre 8 y 30 caracteres',
  })
  password?: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: Role,
    enumName: 'Role',
    example: Role.CLIENTE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, {
    message: 'El rol debe ser uno válido: admin, empleado o cliente',
  })
  role?: Role;
}
