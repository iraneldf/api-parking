import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: keyof PrismaUser | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: PrismaUser }>();

    if (!request.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    if (data) {
      if (!request.user[data]) {
        throw new UnauthorizedException(
          `Propiedad ${String(data)} no encontrada`,
        );
      }
      return request.user[data];
    }

    return request.user;
  },
);
