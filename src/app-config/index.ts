import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import dbConfig from "./config/dbConfig";
import mailerConfig from "./config/mailerConfig";
import serverConfig from "./config/serverConfig";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      load: [
        dbConfig,
        mailerConfig,
        serverConfig
      ],
      isGlobal: true,
      cache: true
    })
  ],
  exports: []
})
export class AppConfigModule {
}

