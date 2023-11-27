import { Observable } from "rxjs";
import { CallHandler } from "@nestjs/common";
export declare class ExcludeInterceptor {
    private static excludePaths;
    protected static isExcludePaths(requestUrl: string, next: CallHandler, operator: object): Observable<any>;
}
