import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TableServiceBase } from "./base/table.service.base";

@Injectable()
export class TableService extends TableServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async getAvailableTables(desiredTime: string, desiredDate: Date) {
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
  }
}
