import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { PrismaModule } from '../config/prisma.module';
import { LogsModule } from '../logs/logs.module';
import { ReservationValidator } from './validators/reservation.validator';

@Module({
  imports: [PrismaModule, LogsModule],
  controllers: [ParkingController],
  providers: [ParkingService, ReservationValidator],
})
export class ParkingModule {}
