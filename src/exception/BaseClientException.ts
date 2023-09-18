import { HttpException } from "@nestjs/common";



export class BaseClientException extends HttpException {
  constructor(statusCode:number,message:string) {
    super({
        data: null, statusCode: statusCode,
        message: message
      }
      ,statusCode);
  }
}