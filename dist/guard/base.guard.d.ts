import { ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
type verifyUserToken = {
    email: string;
    id: string;
    roles: string[];
};
export type guardRequestType = Request & {
    user: verifyUserToken;
};
export declare class BaseGuard {
    authorizeByToken(context: ExecutionContext, jwtService: JwtService): Promise<boolean>;
    protected extractTokenFromHeader(request: Request): string | undefined;
}
export {};
