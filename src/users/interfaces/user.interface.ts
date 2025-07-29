import { Role } from 'src/common/enums/role.enum';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  number: string;
  role: Role;
}
