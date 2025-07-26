import { User as PrismaUser } from '@prisma/client';
import { Role } from '../../common/enums/role.enum';

export interface UserContext extends PrismaUser {
  id: number;
  email: string;
  name: string;
  role: Role;
}
