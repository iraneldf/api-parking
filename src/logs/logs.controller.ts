import { Controller, Get, Body, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { FilterLogsDto } from './dto/filter-logs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Role } from '../common/enums/role.enum';

@ApiBearerAuth()
@ApiTags('Logs')
@Controller('logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  // @Post()
  // @ApiOperation({
  //   summary: 'Registrar log',
  //   description: 'Registra manualmente un log del sistema',
  // })
  // @ApiResponse({ status: 201, description: 'Log registrado' })
  // async create(@Body() dto: CreateLogDto) {
  //   return this.logsService.createLog(dto);
  // }

  @Get()
  @ApiOperation({
    summary: 'Consultar logs',
    description: 'Obtiene los logs del sistema con filtros',
  })
  @ApiResponse({ status: 200, description: 'Listado de logs' })
  async find(@Query() filter: FilterLogsDto) {
    return this.logsService.getLogs(filter);
  }
}
