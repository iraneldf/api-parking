import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar um nuevo usuário' })
  @ApiResponse({ status: 200, description: 'Registro exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async register(@Body() body: RegisterUserDto) {
    const user = await this.usersService.create({
      ...body,
      role: Role.CLIENTE,
    });
    return await this.authService.login({ ...user, password: body.password });
  }
}
