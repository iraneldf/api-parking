import { PartialType } from '@nestjs/swagger';
import { CreateSpotDto } from 'src/spot/dto/create-spot.dto';

export class UpdateSpotDto extends PartialType(CreateSpotDto) {}
