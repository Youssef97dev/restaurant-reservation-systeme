import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { TableService } from "./table.service";
import { TableControllerBase } from "./base/table.controller.base";

@swagger.ApiTags("tables")
@common.Controller("tables")
export class TableController extends TableControllerBase {
  constructor(
    protected readonly service: TableService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }

  @common.Get("available-tables")
  async getAvailableTables(
    @common.Query("time") desiredTime: string,
    @common.Query("date") desiredDate: string // Expecting the date as a string from the query
  ) {
    // Convert desiredDate to Date object if it's passed as a string
    const parsedDate = new Date(desiredDate);

    const availableTables = await this.service.getAvailableTables(
      desiredTime,
      parsedDate
    );
    return availableTables;
  }
}
