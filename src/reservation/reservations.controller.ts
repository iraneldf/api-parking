import {
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ReservationsService } from './reservations.service';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserContext } from 'src/users/types/user.types';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReplaceReservationDto } from 'src/reservation/dto/replace-reservation.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Reservas')
@ApiBearerAuth()
@Controller('reservas')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Crear una reserva' })
  @ApiResponse({
    status: 201,
    description: 'Reserva creada exitosamente',
  })
  @ApiBody({ type: CreateReservationDto })
  create(@GetUser() user: UserContext, @Body() dto: CreateReservationDto) {
    return this.service.create(user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de reservas',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @ApiParam({ name: 'id', description: 'ID de la reserva', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Reserva encontrada',
  })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Actualizar una reserva existente' })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva a actualizar',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @ApiBody({ type: UpdateReservationDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reemplazar una reserva' })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({
    status: 200,
    description: 'Reserva reemplazada correctamente',
  })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceReservationDto,
  ) {
    return this.service.replace(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Eliminar una reserva por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva a eliminar',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Reserva eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
