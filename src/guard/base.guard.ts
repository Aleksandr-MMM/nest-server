import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "../auth/constants";

type verifyUserToken = {
  email: string,
  id: string,
  roles: string[],
};
export type guardRequestType = Request & { user: verifyUserToken };

/**
 * Базовая реализация проверки Bearer token. Возвращает true если токен
 * прошел проверку, а также добавляет в request свойство user ,
 * иначе выбросит исключение.
 */
@Injectable()
export class BaseGuard {
  async authorizeByToken(context: ExecutionContext, jwtService: JwtService): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      let payload: verifyUserToken;
      payload = await jwtService.verifyAsync<verifyUserToken>(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}