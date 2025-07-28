import { Controller, Get, UseGuards, Put, Body, Param } from '@nestjs/common';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { UserContext } from './types/user.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Actualizar usuario',
    description:
      'Permite al administrador actualizar los datos de un usuario específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(Number(id), data);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Devuelve la información del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario devueltos correctamente',
  })
  getProfile(@GetUser() user: UserContext) {
    return this.usersService.findById(user.id);
  }
}
