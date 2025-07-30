export interface OccupiedSpotDetail {
  spotId: number;
  spotNumber: string;
  vehicle: string;
  reservedAt: Date;
  duration: number;
  endsAt: Date;
}
