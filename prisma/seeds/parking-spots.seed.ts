import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedParkingSpots() {
  try {
    await prisma.parkingSpot.deleteMany({});

    const parkingSpots: Prisma.ParkingSpotCreateManyInput[] = [];

    for (let i = 1; i <= 20; i++) {
      parkingSpots.push({
        number: `A${i.toString().padStart(2, '0')}`,
      });
    }

    const result = await prisma.parkingSpot.createMany({
      data: parkingSpots
    });

    console.log(`Se crearon ${result.count} espacios de estacionamiento`);

    const createdSpots = await prisma.parkingSpot.findMany({
      orderBy: { number: 'asc' },
    });
    console.table(createdSpots);
  } catch (error) {
    console.error('Error al crear los espacios de estacionamiento:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}


