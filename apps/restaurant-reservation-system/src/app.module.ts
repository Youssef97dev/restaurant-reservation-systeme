import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { CustomerModule } from "./customer/customer.module";
import { TableModule } from "./table/table.module";
import { ReservationModule } from "./reservation/reservation.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { ConfigModule } from "@nestjs/config";

import { ScheduleModule } from "@nestjs/schedule";

import { ACLModule } from "./auth/acl.module";
import { AuthModule } from "./auth/auth.module";
import { TableService } from "./table/table.service";

@Module({
  controllers: [],
  imports: [
    ACLModule,
    AuthModule,
    UserModule,
    CustomerModule,
    TableModule,
    ReservationModule,
    HealthModule,
    PrismaModule,
    SecretsManagerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
  ],
  providers: [TableService],
})
export class AppModule {}
