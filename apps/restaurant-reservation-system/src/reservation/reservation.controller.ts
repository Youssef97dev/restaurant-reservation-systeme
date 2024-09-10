import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { ReservationService } from "./reservation.service";
import { ReservationControllerBase } from "./base/reservation.controller.base";
import { Reservation } from "./base/Reservation";
import { AclValidateRequestInterceptor } from "src/interceptors/aclValidateRequest.interceptor";
import { ReservationCreateInput } from "./base/ReservationCreateInput";
import * as errors from "../errors";
import { CustomerCreateInput } from "src/customer/base/CustomerCreateInput";
import { CustomerService } from "src/customer/customer.service";

@swagger.ApiTags("reservations")
@common.Controller("reservations")
export class ReservationController extends ReservationControllerBase {
  constructor(
    protected readonly service: ReservationService,
    protected readonly customerService: CustomerService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @common.Post("/with-customer")
  @swagger.ApiCreatedResponse({ type: Reservation })
  @nestAccessControl.UseRoles({
    resource: "Reservation",
    action: "create",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async createReservationWith(
    @common.Body()
    data: {
      reservationData: ReservationCreateInput;
      customerData: CustomerCreateInput;
    }
  ): Promise<Reservation> {
    const customer = await this.customerService.createCustomer({
      data: {
        ...data.customerData,
        firstName: data.customerData.firstName,
        lastName: data.customerData.lastName,
        email: data.customerData.email,
        note: data.customerData.note,
        phoneNumber: data.customerData.phoneNumber,
      },
    });

    return await this.service.createReservation({
      data: {
        ...data.reservationData,

        customer: {
          connect: {
            id: customer.id,
          },
        },

        table: data.reservationData.table
          ? {
              connect: data.reservationData.table,
            }
          : undefined,

        user: data.reservationData.user
          ? {
              connect: data.reservationData.user,
            }
          : undefined,
      },
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
  }
}
