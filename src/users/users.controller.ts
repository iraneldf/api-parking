import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Put, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserContext } from './types/user.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put(':id')
  @Roles(Role.ADMIN)
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.update(Number(id), data);
  }

  @Get('me')
  getProfile(@GetUser() user: UserContext) {
    return this.usersService.findById(user.id);
  }
}
