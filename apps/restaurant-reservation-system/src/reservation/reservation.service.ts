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
}
