import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      load: [configuration],
      isGlobal: true,
    }),
  ],
  exports: [],
})
export class AppConfigModule {}
