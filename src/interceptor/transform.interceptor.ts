import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface IResponse<T> {
  data: T;
  statusCode: number,
  error: null;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T> > {
   intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T> > {
    return next
      .handle()
      .pipe(map(data =>
       ({ data,
        statusCode: HttpStatus.OK,
        error: null })));
  }
}