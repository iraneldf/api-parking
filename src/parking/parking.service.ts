import {
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

  // todo definir bien este metodo buscar la mejor logica
  async getOccupancy() {
    const now = new Date();

    const spots = await this.prisma.parkingSpot.findMany({
      include: {
        reservations: {
          where: {
            reservedAt: {
              lte: now,
            },
            AND: [
              {
                reservedAt: {
                  gte: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
                },
              },
              {
                duration: {
                  gt: 0,
                },
              },
            ],
          },
          orderBy: { reservedAt: 'desc' },
        },
      },
    });

    const totalSpots = spots.length;
    let occupiedSpots = 0;
    const occupiedDetails: OccupiedSpotDetail[] = [];

    for (const spot of spots) {
      const currentReservation = spot.reservations.find((res) => {
        const start = res.reservedAt.getTime();
        const end = start + res.duration * 60000;
        return start <= now.getTime() && now.getTime() < end;
      });

      if (currentReservation) {
        occupiedSpots++;
        occupiedDetails.push({
          spotId: spot.id,
          vehicle: currentReservation.vehicle,
          reservedAt: currentReservation.reservedAt,
          duration: currentReservation.duration,
          endsAt: new Date(
            currentReservation.reservedAt.getTime() +
              currentReservation.duration * 60000,
          ),
        });
      }
    }

    return {
      totalSpots,
      occupiedSpots,
      availableSpots: totalSpots - occupiedSpots,
      details: occupiedDetails,
    };
  }
}
