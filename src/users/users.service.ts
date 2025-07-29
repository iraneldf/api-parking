import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserInput } from './interfaces/user.interface';
import { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: number): Promise<PrismaUser> {
    if (!id || isNaN(id) || id <= 0) {
      throw new BadRequestException('ID de usuario inválido');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    return user;
  }

  async findAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<PrismaUser> {
    const currentUser = await this.findById(id);

    if (
      updateUserDto.email &&
      updateUserDto.email.toLowerCase() !== currentUser.email
    ) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    const data = {
      ...updateUserDto,
      email: updateUserDto.email?.toLowerCase(),
      ...(updateUserDto.password && {
        password: await bcrypt.hash(updateUserDto.password, 10),
      }),
    };

    return this.prisma.user.update({ where: { id }, data });
  }

  async create(createUserDto: CreateUserInput): Promise<PrismaUser> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está en uso');
    }

    const data = {
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    return this.prisma.user.create({ data });
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.findById(id);
    await this.prisma.user.delete({ where: { id: user.id } });

    return { message: `Usuario con ID ${id} eliminado exitosamente` };
  }
}
