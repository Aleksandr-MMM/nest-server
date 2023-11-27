import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus
} from "@nestjs/common";
import { Observable } from "rxjs";
import { ExcludeInterceptor } from "./ExcludeInterceptor";

interface IResponse<T> {
  data: T;
  statusCode: number,
  error: null;
}

@Injectable()
export class TransformInterceptor<T> extends ExcludeInterceptor
  implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return TransformInterceptor.isExcludePaths(context.switchToHttp().getRequest().route.path,
      next,
      {
        statusCode: HttpStatus.OK,
        error: null
      }
    );
  }
}