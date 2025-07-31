// src/auth/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(
    err: Error | null,
    user: any,
    info: { name?: string; message?: string } | string | undefined,
  ): any {
    if (err || !user) {
      if (typeof info === 'object' && info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado');
      }

      if (typeof info === 'object' && info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }

      throw new UnauthorizedException('Token de autenticación requerido');
    }

    return user;
  }
}
