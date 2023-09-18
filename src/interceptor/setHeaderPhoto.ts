// import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
// import { Observable } from 'rxjs';
//
// import { Response as ExpressResponse } from 'express';
// import { map } from "rxjs/operators";
//
// @Injectable()
// export class TestPhoto implements NestInterceptor {
//   intercept(context:ExecutionContext, next:CallHandler): Observable<any> {
//
//     const ResponseObj:ExpressResponse = context.switchToHttp().getResponse();
//
//     ResponseObj.setHeader('Content-Type', 'image/jpeg' );
//
//     return next.handle();
//   }
// }