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
import { Role } from 'src/common/enums/role.enum';

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

    console.log('Login status:', loginRes.status);
    console.log('Login body:', loginRes.body);

    if (loginRes.status !== 201 && loginRes.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
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

    await prisma.user.update({
      where: { id: 2 },
      data: {
        name: 'Empleado Test',
        role: Role.EMPLEADO,
        email: 'empleado@example.com',
        number: '56121213',
      },
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

    console.log('Reserva response:', res.status, res.body);

    expect(res.status).toBe(201);
    const body = res.body as ReservationResponse;

    expect(body).toHaveProperty('id');
    expect(body.vehicle).toBe('ABC123');
    createdReservationId = body.id;
  });

  it('Consulta ocupación del parking (GET /parking/ocupacion)', async () => {
    const res = await request(app.getHttpServer())
      .get('/parking/ocupacion')
      .set('Authorization', `Bearer ${jwtToken}`);

    console.log('Ocupación response:', res.status, res.body);

    expect(res.status).toBe(200);

    const body = res.body as OccupationResponse;

    expect(typeof body).toBe('object');
    expect(body).toHaveProperty('totalSpots');
    expect(body).toHaveProperty('occupiedSpots');
    expect(body).toHaveProperty('availableSpots');
    expect(Array.isArray(body.details)).toBe(true);
  });

  it('Cancela una reserva (DELETE /parking/cancelar/:id)', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/parking/cancelar/${createdReservationId}`)
      .set('Authorization', `Bearer ${jwtToken}`);

    console.log('Cancelación response:', res.status, res.body);

    expect(res.status).toBe(200);
    const body = res.body as CancelResponse;

    expect(body.message).toBe('Reserva cancelada exitosamente');
  });

  it('Editar un usuario (PUT /usuarios/:id)', async () => {
    const res = await request(app.getHttpServer())
      .put(`/usuarios/2`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        name: 'name modificado',
        email: 'empleadoModificado@example.com',
        password: 'Abc123456',
        number: '53873434',
        role: Role.ADMIN,
      });

    console.log('Editar usuario response:', res.status, res.body);

    expect(res.status).toBe(200);
  });
});
