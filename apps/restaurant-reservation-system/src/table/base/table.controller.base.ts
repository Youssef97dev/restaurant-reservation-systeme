/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { isRecordNotFoundError } from "../../prisma.util";
import * as errors from "../../errors";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import { ApiNestedQuery } from "../../decorators/api-nested-query.decorator";
import * as nestAccessControl from "nest-access-control";
import * as defaultAuthGuard from "../../auth/defaultAuth.guard";
import { TableService } from "../table.service";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { TableCreateInput } from "./TableCreateInput";
import { Table } from "./Table";
import { TableFindManyArgs } from "./TableFindManyArgs";
import { TableWhereUniqueInput } from "./TableWhereUniqueInput";
import { TableUpdateInput } from "./TableUpdateInput";
import { ReservationFindManyArgs } from "../../reservation/base/ReservationFindManyArgs";
import { Reservation } from "../../reservation/base/Reservation";
import { ReservationWhereUniqueInput } from "../../reservation/base/ReservationWhereUniqueInput";

@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class TableControllerBase {
  constructor(
    protected readonly service: TableService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}
  @common.UseInterceptors(AclValidateRequestInterceptor)
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Table })
  @nestAccessControl.UseRoles({
    resource: "Table",
    action: "create",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async createTable(@common.Body() data: TableCreateInput): Promise<Table> {
    return await this.service.createTable({
      data: data,
      select: {
        capacity: true,
        createdAt: true,
        id: true,
        status: true,
        tableNumber: true,
        updatedAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get()
  @swagger.ApiOkResponse({ type: [Table] })
  @ApiNestedQuery(TableFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "Table",
    action: "read",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async tables(@common.Req() request: Request): Promise<Table[]> {
    const args = plainToClass(TableFindManyArgs, request.query);
    return this.service.tables({
      ...args,
      select: {
        capacity: true,
        createdAt: true,
        id: true,
        status: true,
        tableNumber: true,
        updatedAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: Table })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Table",
    action: "read",
    possession: "own",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async table(
    @common.Param() params: TableWhereUniqueInput
  ): Promise<Table | null> {
    const result = await this.service.table({
      where: params,
      select: {
        capacity: true,
        createdAt: true,
        id: true,
        status: true,
        tableNumber: true,
        updatedAt: true,
      },
    });
    /*if (result === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }*/
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @common.Patch("/:id")
  @swagger.ApiOkResponse({ type: Table })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Table",
    action: "update",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async updateTable(
    @common.Param() params: TableWhereUniqueInput,
    @common.Body() data: TableUpdateInput
  ): Promise<Table | null> {
    try {
      return await this.service.updateTable({
        where: params,
        data: data,
        select: {
          capacity: true,
          createdAt: true,
          id: true,
          status: true,
          tableNumber: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      /*if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }*/
      throw error;
    }
  }

  @common.Delete("/:id")
  @swagger.ApiOkResponse({ type: Table })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @nestAccessControl.UseRoles({
    resource: "Table",
    action: "delete",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async deleteTable(
    @common.Param() params: TableWhereUniqueInput
  ): Promise<Table | null> {
    try {
      return await this.service.deleteTable({
        where: params,
        select: {
          capacity: true,
          createdAt: true,
          id: true,
          status: true,
          tableNumber: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      /*if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }*/
      throw error;
    }
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("/:id/reservations")
  @ApiNestedQuery(ReservationFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "Reservation",
    action: "read",
    possession: "any",
  })
  async findReservations(
    @common.Req() request: Request,
    @common.Param() params: TableWhereUniqueInput
  ): Promise<Reservation[]> {
    const query = plainToClass(ReservationFindManyArgs, request.query);
    const results = await this.service.findReservations(params.id, {
      ...query,
      select: {
        cover: true,
        createdAt: true,

        customer: {
          select: {
            id: true,
          },
        },

        id: true,
        note: true,
        reservationDate: true,
        reservationTime: true,
        status: true,

        table: {
          select: {
            id: true,
          },
        },

        updatedAt: true,

        user: {
          select: {
            id: true,
          },
        },
      },
    });
    /*if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }*/
    return results;
  }

  @common.Post("/:id/reservations")
  @nestAccessControl.UseRoles({
    resource: "Table",
    action: "update",
    possession: "any",
  })
  async connectReservations(
    @common.Param() params: TableWhereUniqueInput,
    @common.Body() body: ReservationWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      reservations: {
        connect: body,
      },
    };
    await this.service.updateTable({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Patch("/:id/reservations")
  @nestAccessControl.UseRoles({
    resource: "Table",
    action: "update",
    possession: "any",
  })
  async updateReservations(
    @common.Param() params: TableWhereUniqueInput,
    @common.Body() body: ReservationWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      reservations: {
        set: body,
      },
    };
    await this.service.updateTable({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Delete("/:id/reservations")
  @nestAccessControl.UseRoles({
    resource: "Table",
    action: "update",
    possession: "any",
  })
  async disconnectReservations(
    @common.Param() params: TableWhereUniqueInput,
    @common.Body() body: ReservationWhereUniqueInput[]
  ): Promise<void> {
    const data = {
      reservations: {
        disconnect: body,
      },
    };
    await this.service.updateTable({
      where: params,
      data,
      select: { id: true },
    });
  }
}
