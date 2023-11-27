import { ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
export declare class BaseGuard {
    authorizeByToken(context: ExecutionContext, jwtService: JwtService): Promise<boolean>;
    protected extractTokenFromHeader(request: Request): string | undefined;
}
