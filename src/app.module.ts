import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    // MongooseModule.forRoot(
    //   process.env.MONGO_URI || 'localhost:27017/mi_base_datos_mongo',
    // ),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
