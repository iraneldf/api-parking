import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class ReservationValidator {
  constructor(private prisma: PrismaService) {}

  async validateReservation(
    userId: number,
    vehicle: string,
    reservedAt: Date,
    duration: number,
  ) {
    this.validateDuration(duration);
    this.validateDate(reservedAt);
    this.validateOperatingHours(reservedAt);
    await Promise.all([
      this.validateVehicleConflicts(vehicle, reservedAt),
      // this.validateUserReservationLimits(userId),
    ]);
  }

  private validateDuration(duration: number) {
    if (duration < 10) {
      throw new BadRequestException(
        'No se debe reservar una plaza menos de 10 minutos',
      );
    }
  }

  private validateDate(reservedAt: Date) {
    const now = new Date();
    if (reservedAt.getTime() <= now.getTime()) {
      throw new BadRequestException(
        'La fecha y hora de reserva no pueden ser anteriores a la fecha actual',
      );
    }
  }

  private async validateVehicleConflicts(vehicle: string, reservedAt: Date) {
    const thirtyMinutes = 30 * 60000;
    const startRange = new Date(reservedAt.getTime() - thirtyMinutes);
    const endRange = new Date(reservedAt.getTime() + thirtyMinutes);

    const existing = await this.prisma.reservation.findFirst({
      where: {
        vehicle,
        reservedAt: {
          gte: startRange,
          lte: endRange,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Este vehículo ya tiene una reserva activa en un horario cercano',
      );
    }
  }

  private async validateUserReservationLimits(userId: number) {
    const now = new Date();

    const count = await this.prisma.reservation.count({
      where: {
        userId,
        reservedAt: {
          gte: now,
        },
      },
    });

    if (count >= 3) {
      throw new ConflictException(
        'Has alcanzado el límite máximo de reservas activas (3)',
      );
    }
  }

  private validateOperatingHours(reservedAt: Date) {
    const hour = reservedAt.getUTCHours(); // ← Garantiza que usemos UTC siempre

    if (hour < 6 || hour > 22) {
      throw new BadRequestException(
        'Las reservas solo están disponibles entre 6:00 AM y 10:00 PM (hora UTC)',
      );
    }
  }

  private validateWeekendRules(reservedAt: Date) {
    const day = reservedAt.getUTCDay(); // 0 = Domingo, 6 = Sábado
    const hour = reservedAt.getUTCHours();

    if (day === 0 || day === 6) {
      if (hour < 8 || hour > 20) {
        throw new BadRequestException(
          'Los fines de semana el horario de reservas es de 8:00 AM a 8:00 PM (hora UTC)',
        );
      }
    }
  }
}
