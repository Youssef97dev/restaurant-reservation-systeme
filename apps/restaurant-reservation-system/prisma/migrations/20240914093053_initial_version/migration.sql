/*
  Warnings:

  - The values [Pending] on the enum `EnumReservationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "EnumReservationFloor" AS ENUM ('Terasse', 'Rdc', 'SousSol');

-- AlterEnum
BEGIN;
CREATE TYPE "EnumReservationStatus_new" AS ENUM ('Confirmed', 'Booked', 'Cancelled', 'Completed');
ALTER TABLE "Reservation" ALTER COLUMN "status" TYPE "EnumReservationStatus_new" USING ("status"::text::"EnumReservationStatus_new");
ALTER TYPE "EnumReservationStatus" RENAME TO "EnumReservationStatus_old";
ALTER TYPE "EnumReservationStatus_new" RENAME TO "EnumReservationStatus";
DROP TYPE "EnumReservationStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "floor" "EnumReservationFloor";
