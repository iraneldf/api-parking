/*
  Warnings:

  - You are about to drop the column `isOccupied` on the `ParkingSpot` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSpot" DROP COLUMN "isOccupied";

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "duration" INTEGER NOT NULL;
