import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthService {
  /**
   * удаляет все свойства кроме email и id
   * @param obj свойство
   * @protected
   */
  protected payloadRemove(obj) {
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
    return this.payloadRemove(user);
  }

  /**
   * Возвращает зашифрованый токен(email,id) пользователя
   */
  async signIn(email: string, id: string): Promise<any> {
    return await this.getToken({ email: email,id:id });
  }

  /**
   * Возвращает зашифрованый токен(email) пользователя
   */
  async getTemporaryToken(email: string,pass:string): Promise<{access_token: string}> {
    return await this.getToken({ email: email,password:pass });
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