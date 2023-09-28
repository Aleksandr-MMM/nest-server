import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { Role } from "../guard/RoleGuard/role.enum";

@Injectable()
export class AuthService {
  /**
   * удаляет все свойства кроме email и id
   * @param obj свойство
   * @protected
   */
  protected returnMailAndId(obj) {
    return { email: obj?.email, id: obj?.id };
  };

  constructor(
    private jwtService: JwtService) {
  }
  protected async getToken(obj: object):Promise<{access_token: string}> {
    const payload = { ...obj };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  /**
   * @param user Возвращает профиль текущего пользователя
   */
  public identificationMe(user) {
    return this.returnMailAndId(user);
  }

  /**
   * Возвращает зашифрованый токен(email,id) пользователя
   */
  async signIn(email: string, id: string,roles:Role[]): Promise<any> {
    return await this.getToken({ email: email,id:id,roles:roles });
  }

  /**
   * Возвращает зашифрованый токен(email) пользователя
   */
  async getTemporaryToken(email: string,pass:string,roles:Role[]): Promise<{access_token: string}> {
    return await this.getToken({ email: email,password:pass,roles:roles });
  }

  async token(token:string){
    try {
      return await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
    } catch {
      throw new UnauthorizedException();
    }
  }
}