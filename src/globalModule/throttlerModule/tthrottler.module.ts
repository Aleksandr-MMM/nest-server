import { Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      /**
       * время ожидания в миллисекундах
       */
      ttl: 300,
      /**
       * максимальное количество запросов за период ttl
       */
      limit: 10
    }])
  ], providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }]
})
export class GlobalThrottlerModule {
}