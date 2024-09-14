import { Injectable } from "@nestjs/common";
import { CronExpression, Cron } from "@nestjs/schedule";
import { ReservationService } from "src/reservation/reservation.service";
import { PrismaService } from "../prisma/prisma.service";
import { TableServiceBase } from "./base/table.service.base";
import { addHours, isBefore } from "date-fns";

@Injectable()
export class TableService extends TableServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly reservationService: ReservationService
  ) {
    super(prisma);
  }

  /*async getAvailableTables(desiredTime: string, desiredDate: Date) {
    const availableTables = await this.prisma.table.findMany({
      where: {
        reservations: {
          none: {
            reservationTime: desiredTime,
            reservationDate: desiredDate,
          },
        },
      },
    });
    return availableTables;
  }*/

  // Run cron job every 30 minutes
  /*@Cron(CronExpression.EVERY_30_SECONDS)
  async checkReservations() {
    const currentDate = new Date();

    // Get reservations for today
    const reservations = await this.reservationService.findReservationsForToday(
      currentDate
    );
    for (const reservation of reservations) {
      const reservationTime = new Date(reservation.reservationDate);
      const [time, modifier] = reservation.reservationTime.split(" "); // ['19:30', 'PM']
      const [hoursStr, minutesStr] = time.split(":"); // ['19', '30']
      reservationTime.setUTCHours(parseInt(hoursStr), parseInt(minutesStr));

      //new Date(currentDate.setHours(currentDate.getHours() + 1)
      // Change table status to 'Occupied' if the reservation time is within the next 30 minutes
      if (
        isBefore(reservationTime, addHours(currentDate, 1)) &&
        isBefore(addHours(currentDate, 1), addHours(reservationTime, 2)) &&
        reservation.table?.status !== "Reserved"
      ) {
        await this.prisma.table.update({
          data: {
            status: "Reserved",
          },
          where: {
            id: reservation.table?.id,
          },
        });
      }

      // After 2 hours, revert table status to 'Available'
      if (
        isBefore(addHours(reservationTime, 2), addHours(currentDate, 1)) &&
        reservation.table?.status !== "Available"
      ) {
        await this.prisma.table.update({
          data: {
            status: "Available",
          },
          where: {
            id: reservation.table?.id,
          },
        });
      }
    }
  }*/
}
