import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface RequestUser {
  role: string;
  userId: number;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<{ user: RequestUser }>();
    const user: RequestUser = request.user;
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Permisos insuficientes');
    }
    return requiredRoles.includes(user.role);
  }
}
