import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SpotService } from './spot.service';
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
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { ReplaceParkingSpotDto } from 'src/spot/dto/replace-spot.dto';

@ApiBearerAuth()
@ApiTags('Plazas')
@Controller('spot')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class SpotController {
  constructor(private spotService: SpotService) {}

  @Post('crear')
  @ApiOperation({
    summary: 'Crear plaza',
    description: 'Crea una nueva plaza de parking',
  })
  @ApiResponse({ status: 201, description: 'Plaza creada' })
  async create(@Body() body: CreateSpotDto) {
    return this.spotService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar plazas',
    description: 'Devuelve todas las plazas de parking',
  })
  async findAll() {
    return this.spotService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener plaza por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spotService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar plaza por ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateSpotDto,
  ) {
    return this.spotService.update(id, body);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reemplazar una plaza de parking' })
  @ApiParam({ name: 'id', description: 'ID de la plaza de parking' })
  @ApiResponse({ status: 200, description: 'Plaza reemplazada correctamente' })
  @ApiResponse({ status: 404, description: 'Plaza no encontrada' })
  replaceSpot(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceParkingSpotDto,
  ) {
    return this.spotService.replace(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar plaza por ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.spotService.remove(id);
  }
}
