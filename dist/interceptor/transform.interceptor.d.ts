import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { ExcludeInterceptor } from "./ExcludeInterceptor";
interface IResponse<T> {
    data: T;
    statusCode: number;
    error: null;
}
export declare class TransformInterceptor<T> extends ExcludeInterceptor implements NestInterceptor<T, IResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>>;
}
export {};
