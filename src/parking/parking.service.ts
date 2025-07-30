import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { LogsService } from '../logs/logs.service';
import { IReserveSpot } from './interfaces/reverve-spot.interface';
import { ReservationValidator } from './validators/reservation.validator';
import { OccupiedSpotDetail } from 'src/parking/interfaces/ocuped-spot.interface';

@Injectable()
export class ParkingService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
    private reservationValidator: ReservationValidator,
  ) {}

  async reserveSpot(userId: number, data: IReserveSpot) {
    await this.reservationValidator.validateReservation(
      userId,
      data.vehicle,
      data.reservedAt,
      data.duration,
    );

    const endDate = new Date(data.reservedAt.getTime() + data.duration * 60000);

    const availableSpot = await this.prisma.parkingSpot.findFirst({
      where: {
        reservations: {
          none: {
            reservedAt: {
              lt: endDate,
            },
            AND: {
              reservedAt: {
                gt: new Date(data.reservedAt.getTime() - data.duration * 60000),
              },
            },
          },
        },
      },
    });

    if (!availableSpot) {
      throw new NotFoundException('No hay plazas disponibles para ese horario');
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        ...data,
        userId,
        spotId: availableSpot.id,
      },
      include: { spot: true },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    await this.logsService.createLog({
      type: 'reserva',
      message: `Usuario ${user?.name} reservó una plaza para el vehículo ${data.vehicle}`,
      userId,
      data: {
        reservationId: reservation.id,
        reservedAt: data.reservedAt,
        duration: data.duration,
      },
    });

    return reservation;
  }

  async cancelReservation(userId: number, reservationId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reservation.userId !== userId) {
      throw new ForbiddenException(
        'No puede cancelar reservas de otro usuario',
      );
    }

    await this.prisma.reservation.delete({
      where: { id: reservationId },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    await this.logsService.createLog({
      type: 'cancelacion',
      message: `Usuario ${user?.name} canceló la reserva ${reservationId}`,
      userId,
      data: {
        reservationId,
        canceledAt: new Date(),
      },
    });

    return { message: 'Reserva cancelada exitosamente' };
  }

  async getOccupancy() {
    const now = new Date();

    const spots = await this.prisma.parkingSpot.findMany({
      include: {
        reservations: {
          where: {
            reservedAt: {
              gte: now,
            },
            duration: {
              gt: 0,
            },
          },
          orderBy: { reservedAt: 'asc' },
        },
      },
    });

    const totalSpots = spots.length;
    const occupiedDetails: OccupiedSpotDetail[] = [];

    const occupiedSpotIds = new Set<number>();

    for (const spot of spots) {
      for (const res of spot.reservations) {
        const start = res.reservedAt.getTime();
        const end = start + res.duration * 60000;

        occupiedDetails.push({
          spotId: spot.id,
          spotNumber: spot.number,
          vehicle: res.vehicle,
          reservedAt: res.reservedAt,
          duration: res.duration,
          endsAt: new Date(end),
        });

        occupiedSpotIds.add(spot.id);
      }
    }

    const occupiedSpots = occupiedSpotIds.size;
    const availableSpots = totalSpots - occupiedSpots;

    return {
      totalSpots,
      occupiedSpots,
      availableSpots,
      details: occupiedDetails,
    };
  }

  async registerEntry(reservationId: number, userId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { spot: true },
    });

    if (!reservation) throw new NotFoundException('Reserva no encontrada');
    if (reservation.actualArrival)
      throw new BadRequestException('Ya se registró la entrada');

    await this.prisma.reservation.update({
      where: { id: reservationId },
      data: { actualArrival: new Date() },
    });

    const employee = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    await this.logsService.createLog({
      type: 'entrada',
      message: `Vehículo ${reservation.vehicle} ingresó al parking`,
      userId,
      data: {
        reservationId: reservation.id,
        reservedAt: reservation.reservedAt,
        by: employee?.name,
        by_userId: userId,
      },
    });

    return { message: 'Entrada registrada' };
  }

  async registerExit(id: number, userId: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reservation.actualDeparture) {
      throw new BadRequestException(
        'La salida ya fue registrada para esta reserva',
      );
    }

    const now = new Date();
    await this.prisma.reservation.update({
      where: { id },
      data: { actualDeparture: now },
    });
    const employee = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    await this.logsService.createLog({
      type: 'salida',
      message: `Salida registrada para el vehículo ${reservation.vehicle}`,
      userId: reservation.userId,
      data: {
        reservationId: reservation.id,
        actualDeparture: now,
        by: employee?.name,
        by_userId: userId,
      },
    });

    return {
      message: 'Salida registrada correctamente',
      actualDeparture: now,
    };
  }
}
