import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from "./base.guard";

@Injectable()
export class AuthGuard extends BaseGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return this.authorizeByToken(context,this.jwtService)
  }

}