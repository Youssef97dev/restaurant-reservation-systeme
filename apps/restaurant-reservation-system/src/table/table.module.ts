import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TableModuleBase } from "./base/table.module.base";
import { TableService } from "./table.service";
import { TableController } from "./table.controller";

@Module({
  imports: [TableModuleBase, forwardRef(() => AuthModule)],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
