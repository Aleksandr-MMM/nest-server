import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppConfigModule } from "./app-config";
import { RavendbService } from "./repository/services/ravendb/ravendb.service";
import { PersistenceModule } from "./repository";
import { AllRepoModules } from "./repository/RepoModule/AllRepoModules";
import { AuthModule } from "./auth/auth.module";
import { NestMailerModule } from "./globalModule/nestMailerModule/NestMailer.module";
import { GlobalThrottlerModule } from "./globalModule/throttlerModule/tthrottler.module";

@Module({
  imports: [
    AppConfigModule, PersistenceModule, AllRepoModules, AuthModule,
    NestMailerModule, GlobalThrottlerModule,
  ],
  controllers: [AppController],
  providers: [
    RavendbService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard
    // }
    ]
})
export class AppModule {
}
