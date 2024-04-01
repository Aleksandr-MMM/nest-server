import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./role.enum";
import { ROLES_KEY } from "./roles.decorator";
import { JwtService } from "@nestjs/jwt";
import { BaseGuard } from "../base.guard";


@Injectable()
export class RolesGuard extends BaseGuard implements CanActivate {
  constructor(private reflector: Reflector,
              private jwtService: JwtService) {
    super()
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if(await this.authorizeByToken(context,this.jwtService)){
      /**
       *Найти переданную декоратору роли
       */
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass()
      ]);
      if (!requiredRoles) {
        return true;
      }
      const  user  = context.switchToHttp().getRequest();
      return requiredRoles.some((role) =>
        user.user?.roles?.includes(role))
    }
    else return false
    // return requiredRoles.some((role) => user?.roles?.includes(role))
  }
}