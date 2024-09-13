import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ReservationServiceBase } from "./base/reservation.service.base";

import { Prisma, Reservation as PrismaReservation } from "@prisma/client";
import { endOfDay, startOfDay, addHours } from "date-fns";

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
}
