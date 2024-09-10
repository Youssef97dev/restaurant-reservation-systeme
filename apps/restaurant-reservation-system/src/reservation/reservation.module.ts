import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ReservationModuleBase } from "./base/reservation.module.base";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { CustomerService } from "src/customer/customer.service";

@Module({
  imports: [ReservationModuleBase, forwardRef(() => AuthModule)],
  controllers: [ReservationController],
  providers: [ReservationService, CustomerService],
  exports: [ReservationService, CustomerService],
})
export class ReservationModule {}
