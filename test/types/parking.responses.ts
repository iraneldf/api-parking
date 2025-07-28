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

export interface OccupationResponse {
  id: number;
  number: string;
  isOccupied: boolean;
}
