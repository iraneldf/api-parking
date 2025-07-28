import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/config/prisma.service';
import {
  CancelResponse,
  LoginResponse,
  OccupationResponse,
  ReservationResponse,
} from './types/parking.responses';

describe('ParkingController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;
  let createdReservationId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = app.get(PrismaService);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@parking.com', password: 'admin123' });
    // .send({ email: 'cliente@example.com', password: '123456' });

    console.log('Login status:', loginRes.status);
    console.log('Login body:', loginRes.body);

    if (loginRes.status !== 201 && loginRes.status !== 200) {
      throw new Error('Login failed in beforeAll, cannot run tests');
    }

    const loginBody = loginRes.body as LoginResponse;
    jwtToken = loginBody.access_token;
    if (!jwtToken) {
      throw new Error('No JWT token received in login response');
    }
  });

  afterAll(async () => {
    await prisma.reservation.deleteMany({
      where: { vehicle: 'ABC123' },
    });
    await app.close();
  });

  it('Reserva una plaza de parking (POST /parking/reservar)', async () => {
    const reservationDate = new Date(Date.now() + 3600000).toISOString();

    const res = await request(app.getHttpServer())
      .post('/parking/reservar')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        vehicle: 'ABC123',
        reservedAt: reservationDate,
        duration: 60,
      });

    expect(res.status).toBe(201);

    const body = res.body as ReservationResponse;
    expect(body.vehicle).toBe('ABC123');

    createdReservationId = body.id;
  });

  it('Consulta ocupación del parking (GET /parking/ocupacion)', async () => {
    const res = await request(app.getHttpServer())
      .get('/parking/ocupacion')
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);

    const body = res.body as OccupationResponse[];
    expect(Array.isArray(body)).toBe(true);
  });

  it('Cancela una reserva (DELETE /parking/cancelar/:id)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/parking/cancelar/${createdReservationId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(res.status).toBe(200);

    const body = res.body as CancelResponse;
    expect(body.message).toBe('Reserva cancelada exitosamente');
  });
});
