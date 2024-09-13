import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TableServiceBase } from "./base/table.service.base";

@Injectable()
export class TableService extends TableServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
