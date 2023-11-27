import { HttpException } from "@nestjs/common";



export class BaseClientException extends HttpException {
  constructor(statusCode:number,message:string) {
    super({ message: message },statusCode);
  }
}