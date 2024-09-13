import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ReservationModuleBase } from "./base/reservation.module.base";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";

@Module({
  imports: [ReservationModuleBase, forwardRef(() => AuthModule)],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
