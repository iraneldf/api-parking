import { Role } from '../../common/enums/role.enum';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: Role;
}
