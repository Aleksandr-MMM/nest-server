import { Observable,  } from "rxjs";
import { CallHandler } from "@nestjs/common";
import { map } from "rxjs/operators";

export class ExcludeInterceptor {
  private static excludePaths = ["/auth/confirmReg/:token","/user/photo/:id"];
  protected static isExcludePaths(requestUrl: string, next: CallHandler,
    operator: object
  ): Observable<any> {
    if (ExcludeInterceptor.excludePaths.includes(requestUrl)) {
      return next.handle();
    } else {
      return next.handle().pipe(map(
          data => ({ data, ...operator })
        )
      )
    }
  }
}