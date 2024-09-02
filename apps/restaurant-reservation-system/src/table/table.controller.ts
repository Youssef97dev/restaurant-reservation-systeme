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
}
