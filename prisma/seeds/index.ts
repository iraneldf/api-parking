import { PrismaClient } from '@prisma/client';
import { seedUsers } from './users.seed';
import { seedParkingSpots } from './parking-spots.seed';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Iniciando proceso de seeding...');

    console.log('\n🔑 Creando usuarios...');
    await seedUsers();

    console.log('\n🅿️ Creando espacios de estacionamiento...');
    await seedParkingSpots();

    console.log('\n✅ ¡Seeding completado con éxito!');
  } catch (error) {
    console.error('\n❌ Error durante el proceso de seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
