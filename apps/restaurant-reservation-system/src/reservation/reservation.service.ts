import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ReservationServiceBase } from "./base/reservation.service.base";

import { Prisma, Reservation as PrismaReservation } from "@prisma/client";
import { endOfDay, startOfDay, addHours, isBefore } from "date-fns";
import { CronExpression, Cron } from "@nestjs/schedule";

@Injectable()
export class ReservationService extends ReservationServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findReservationsForToday(currentDate: Date) {
    const startOfDay_: any = addHours(startOfDay(currentDate), -11);
    const endOfDay_: any = endOfDay(currentDate);
    const reservations = this.prisma.reservation.findMany({
      where: {
        reservationDate: {
          gte: startOfDay_,
          lt: endOfDay_,
        },
      },
      include: {
        table: true, // Include the related table data
        customer: true,
      },
    });
    return reservations;
  }

  async getReservationsByMonth(year: number) {
    // Query the database to group reservations by month for the specified year
    const result = await this.prisma.reservation.groupBy({
      by: ["reservationDate"],
      where: {
        reservationDate: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`), // Start of the year
          lt: new Date(`${year + 1}-01-01T00:00:00.000Z`), // Start of the next year
        },
        status: {
          not: "Cancelled",
        },
      },
      _count: {
        id: true, // Count the number of reservations
      },
      orderBy: {
        reservationDate: "asc", // Order by date ascending
      },
    });

    // Initialize an array for all months (12 months, starting from January)
    const reservationsByMonth = Array(12).fill(0);

    // Populate the array based on the month
    result.forEach((reservation) => {
      const month = new Date(reservation.reservationDate).getMonth(); // Get the month (0-indexed)

      reservationsByMonth[month] += reservation._count.id; // Add reservation count to the respective month
    });
    return reservationsByMonth;
  }

  // Run cron job every 30 minutes
  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkReservations() {
    const currentDate = new Date();

    // Get reservations for today
    const reservations = await this.findReservationsForToday(currentDate);
    for (const reservation of reservations) {
      const reservationTime = new Date(reservation.reservationDate);
      const [time, modifier] = reservation.reservationTime.split(" "); // ['19:30', 'PM']
      const [hoursStr, minutesStr] = time.split(":"); // ['19', '30']
      reservationTime.setUTCHours(parseInt(hoursStr), parseInt(minutesStr));

      //new Date(currentDate.setHours(currentDate.getHours() + 1)
      // Change table status to 'Occupied' if the reservation time is within the next 30 minutes
      /*if (
        isBefore(reservationTime, addHours(currentDate, 1)) &&
        isBefore(addHours(currentDate, 1), addHours(reservationTime, 2)) &&
        reservation.status !== "Completed" && reservation.status !== "Cancelled"
      ) {
        await this.prisma.reservation.update({
          data: {
            status: "Completed",
          },
          where: {
            id: reservation.id,
          },
        });
      }*/
      // After 2 hours, revert table status to 'Available'
      if (
        isBefore(addHours(reservationTime, 2), addHours(currentDate, 1)) &&
        reservation.status !== "Completed" &&
        reservation.status !== "Cancelled"
      ) {
        await this.prisma.reservation.update({
          data: {
            status: "Completed",
          },
          where: {
            id: reservation.id,
          },
        });
      }
    }
  }
}
