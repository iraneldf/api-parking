// src/parking/validators/reservation.validator.ts
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
// todo ver todas las validaciones posibles
@Injectable()
export class ReservationValidator {
  constructor(private prisma: PrismaService) {}

  async validateReservation(
    userId: number,
    vehicle: string,
    reservedAt: Date,
    // duration: number,
  ) {
    this.validateDate(reservedAt);
    this.validateOperatingHours(reservedAt);
    // this.validateWeekendRules(reservedAt);
    await Promise.all([
      // this.validateTimeConflicts(userId, reservedAt),
      this.validateVehicleConflicts(vehicle, reservedAt),
      this.validateUserReservationLimits(userId),
    ]);
  }
  // todo ver tema de las fechas
  private validateDate(reservedAt: Date) {
    const now = new Date();
    if (reservedAt <= now) {
      throw new BadRequestException(
        'La fecha y hora de reserva no pueden ser anteriores a la fecha actual',
      );
    }
  }

  private async validateTimeConflicts(userId: number, reservedAt: Date) {
    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        userId,
        reservedAt: {
          gte: new Date(reservedAt.getTime() - 30 * 60000),
          lte: new Date(reservedAt.getTime() + 30 * 60000),
        },
      },
    });

    if (existingReservation) {
      throw new ConflictException(
        'Ya tienes una reserva activa en un horario cercano (30 minutos antes o despues)',
      );
    }
  }

  private async validateVehicleConflicts(vehicle: string, reservedAt: Date) {
    const existingVehicleReservation = await this.prisma.reservation.findFirst({
      where: {
        vehicle,
        reservedAt: {
          gte: new Date(reservedAt.getTime() - 30 * 60000),
          lte: new Date(reservedAt.getTime() + 30 * 60000),
        },
      },
    });

    if (existingVehicleReservation) {
      throw new ConflictException(
        'Este vehículo ya tiene una reserva activa en un horario cercano',
      );
    }
  }

  private async validateUserReservationLimits(userId: number) {
    const activeReservations = await this.prisma.reservation.count({
      where: {
        userId,
        reservedAt: {
          gte: new Date(),
        },
      },
    });

    if (activeReservations >= 3) {
      throw new ConflictException(
        'Has alcanzado el límite máximo de reservas activas (3)',
      );
    }
  }

  private validateOperatingHours(reservedAt: Date) {
    const hour = reservedAt.getUTCHours();
    if (hour < 6 || hour > 22) {
      throw new BadRequestException(
        'Las reservas solo están disponibles entre 6:00 AM y 10:00 PM',
      );
    }

    const now = new Date();
    if (
      reservedAt.toDateString() === now.toDateString() &&
      reservedAt.getTime() <= now.getTime()
    ) {
      throw new BadRequestException(
        'No se pueden hacer reservas para horarios que ya pasaron',
      );
    }
  }

  private validateWeekendRules(reservedAt: Date) {
    const day = reservedAt.getUTCDay();
    const hour = reservedAt.getUTCHours();

    // Reglas especiales para fines de semana
    if (day === 0 || day === 6) {
      // Sábado o Domingo
      if (hour < 8 || hour > 20) {
        throw new BadRequestException(
          'Los fines de semana el horario de reservas es de 8:00 AM a 8:00 PM',
        );
      }
    }
  }
}
