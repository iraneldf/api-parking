import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateReservationDto } from 'src/reservation/dto/create-reservation.dto';
import { UpdateReservationDto } from 'src/reservation/dto/update-reservation.dto';
import { Reservation } from '@prisma/client';
import { ReplaceReservationDto } from 'src/reservation/dto/replace-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateReservationDto) {
    const spot = await this.findAvailableSpot(dto.reservedAt, dto.duration);
    if (!spot) throw new NotFoundException('No hay plazas disponibles');

    return this.prisma.reservation.create({
      data: { ...dto, spotId: spot.id, userId },
    });
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      include: { spot: true, user: true },
    });
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { spot: true, user: true },
    });
    if (!reservation) throw new NotFoundException('Reserva no encontrada');
    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto) {
    await this.findOne(id);

    return this.prisma.reservation.update({
      where: { id },
      data: dto,
    });
  }

  async replace(id: number, dto: ReplaceReservationDto): Promise<Reservation> {
    const existing = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: {
        vehicle: dto.vehicle ?? existing.vehicle,
        reservedAt: dto.reservedAt ?? existing.reservedAt,
        duration: dto.duration ?? existing.duration,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.reservation.delete({ where: { id } });
  }

  private async findAvailableSpot(reservedAt: Date, duration: number) {
    const endDate = new Date(reservedAt.getTime() + duration * 60000);
    return this.prisma.parkingSpot.findFirst({
      where: {
        reservations: {
          none: {
            reservedAt: { lt: endDate },
            AND: {
              reservedAt: {
                gt: new Date(reservedAt.getTime() - duration * 60000),
              },
            },
          },
        },
      },
    });
  }
}
