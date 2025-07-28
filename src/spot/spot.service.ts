import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';

@Injectable()
export class SpotService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSpotDto) {
    const exists = await this.prisma.parkingSpot.findFirst({
      where: {
        number: data.number,
      },
    });
    if (exists) {
      throw new BadRequestException('Ya existe una plaza con este número');
    }
    return this.prisma.parkingSpot.create({ data });
  }

  async findAll() {
    return this.prisma.parkingSpot.findMany();
  }

  async findOne(id: number) {
    const spot = await this.prisma.parkingSpot.findUnique({ where: { id } });
    if (!spot) throw new NotFoundException('Plaza no encontrada');
    return spot;
  }

  async update(id: number, data: UpdateSpotDto) {
    if (data.number) {
      const exists = await this.prisma.parkingSpot.findFirst({
        where: {
          number: data.number,
          NOT: { id },
        },
      });
      if (exists) {
        throw new BadRequestException('Ya existe una plaza con este número');
      }
    }
    return this.prisma.parkingSpot.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.parkingSpot.delete({ where: { id } });
  }
}
