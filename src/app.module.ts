import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SpotModule } from './spot/spot.module';
import { ParkingModule } from './parking/parking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'localhost:27017/parking_logs',
    ),
    AuthModule,
    UsersModule,
    ParkingModule,
    SpotModule,
  ],
})
export class AppModule {}
