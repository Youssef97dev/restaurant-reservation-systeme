import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { ReservationService } from "./reservation.service";
import { ReservationControllerBase } from "./base/reservation.controller.base";
import { Reservation } from "./base/Reservation";
import * as errors from "../errors";
import { CustomerService } from "src/customer/customer.service";
import { ReservationFindManyArgs } from "./base/ReservationFindManyArgs";
import { AclFilterResponseInterceptor } from "src/interceptors/aclFilterResponse.interceptor";
import { ApiNestedQuery } from "src/decorators/api-nested-query.decorator";

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

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("today")
  @swagger.ApiOkResponse({ type: [Reservation] })
  @ApiNestedQuery(ReservationFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "Reservation",
    action: "read",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async reservationsToday(
    @common.Req() request: Request
  ): Promise<Reservation[]> {
    const currentDate = new Date();

    const reservations = await this.service.findReservationsForToday(
      currentDate
    );
    return reservations;
  }

  //@common.UseInterceptors(AclFilterResponseInterceptor)
  @common.Get("by-month")
  //@swagger.ApiOkResponse({ type: [Reservation] })
  //@ApiNestedQuery(ReservationFindManyArgs)
  @nestAccessControl.UseRoles({
    resource: "Reservation",
    action: "read",
    possession: "any",
  })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
  async reservationsByMonth(
    @common.Query("year") year_: string
  ): Promise<any[]> {
    const year = parseInt(year_);
    if (isNaN(year)) {
      throw new Error("Invalid year format"); // Ensure the year is a valid number
    }

    const reservations = await this.service.getReservationsByMonth(year);

    return reservations;
  }
}
