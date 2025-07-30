import { Role } from 'src/common/enums/role.enum';

export interface LoginResponse {
  access_token: string;
}

export interface ReservationResponse {
  id: number;
  vehicle: string;
  reservedAt: string;
  duration: number;
  spotId: number;
}

export interface CancelResponse {
  message: string;
}

export interface OccupationDetailsResponse {
  spotId: number;
  spotNumber: string;
  vehicle: string;
  reservedAt: Date;
  duration: number;
  endsAt: Date;
}

export interface OccupationResponse {
  totalSpots: number;
  occupiedSpots: number;
  availableSpots: number;
  details: OccupationDetailsResponse[];
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  number: boolean;
  role: Role;
}
