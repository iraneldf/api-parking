import { ReservationsController } from 'src/reservation/reservations.controller';
import { ReservationsService } from 'src/reservation/reservations.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
