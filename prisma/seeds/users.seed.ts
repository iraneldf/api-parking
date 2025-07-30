import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Role } from '../../src/common/enums/role.enum';

const prisma = new PrismaClient();

export async function seedUsers() {
  try {
    await prisma.reservation.deleteMany();
    await prisma.parkingSpot.deleteMany();
    await prisma.user.deleteMany();

    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const hashedEmployeePassword = await bcrypt.hash('employee1234', 10);
    const hashedClientPassword = await bcrypt.hash('123456', 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@parking.com',
        password: hashedAdminPassword,
        name: 'Administrador',
        number: '56121212',
        role: Role.ADMIN,
      },
    });

    const employeeUser = await prisma.user.create({
      data: {
        email: 'empleado@example.com',
        password: hashedEmployeePassword,
        name: 'Empleado Test',
        number: '56121213',
        role: Role.EMPLEADO,
      },
    });

    const clientUser = await prisma.user.create({
      data: {
        email: 'cliente@example.com',
        password: hashedClientPassword,
        name: 'Cliente Test',
        number: '56121214',
        role: Role.CLIENTE,
      },
    });

    console.log('✅ Usuarios creados correctamente:');
    console.log('Admin:', adminUser.email);
    console.log('Empleado:', employeeUser.email);
    console.log('Cliente:', clientUser.email);
  } catch (error) {
    console.error('❌ Error al crear datos de prueba:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
