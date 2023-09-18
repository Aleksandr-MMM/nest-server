import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
interface IResponse<T> {
    data: T;
    statusCode: number;
    error: null;
}
export declare class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>>;
}
export {};
