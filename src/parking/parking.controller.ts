import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '../common/enums/role.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserContext } from '../users/types/user.types';
import { ReserveSpotDto } from './dto/reserve-spot.dto';

@ApiBearerAuth()
@ApiTags('Parking')
@Controller('parking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('reservar')
  @Roles(Role.CLIENTE, Role.ADMIN)
  @ApiOperation({
    summary: 'Reservar plaza',
    description: 'Permite a un cliente reservar una plaza de parking',
  })
  @ApiResponse({ status: 201, description: 'Reserva exitosa' })
  // todo ver tema de las fechas q vienen con 4 horas de atraso
  async reserve(@Body() body: ReserveSpotDto, @GetUser() user: UserContext) {
    return this.parkingService.reserveSpot(user.id, body);
  }

  @Delete('cancelar/:id')
  @Roles(Role.CLIENTE, Role.ADMIN)
  @ApiOperation({
    summary: 'Cancelar una reserva',
    description: 'Permite a un cliente cancelar una reserva existente',
  })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({ status: 200, description: 'Reserva cancelada' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @ApiResponse({
    status: 403,
    description: 'No autorizado a cancelar esta reserva',
  })
  async cancelReservation(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserContext,
  ) {
    return this.parkingService.cancelReservation(user.id, id);
  }

  @Get('ocupacion')
  @Roles(Role.EMPLEADO, Role.ADMIN)
  @ApiOperation({
    summary: 'Consultar ocupación',
    description: 'Devuelve información de plazas ocupadas actualmente',
  })
  @ApiResponse({ status: 200, description: 'Ocupación actual devuelta' })
  async getOccupancy() {
    return this.parkingService.getOccupancy();
  }
}
