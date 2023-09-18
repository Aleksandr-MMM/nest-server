import { HttpException } from "@nestjs/common";
export declare class BaseClientException extends HttpException {
    constructor(statusCode: number, message: string);
}
