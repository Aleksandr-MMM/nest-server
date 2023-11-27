import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes
} from "@nestjs/common";
import { AuthService } from "./Auth.service";
import { UsersDto } from "../repository/validate-dto/Auth.dto";
import { AbstractValidationPipe } from "../helpers/pipes/AbstractValidationPipe";
import { PersistenceService } from "../repository";
import { UsersEntity } from "../repository/entities/users.entity";
import { UsersRepo } from "../repository/repos/users.repo.";
import { MailerService } from "@nestjs-modules/mailer";
import { RegMailSettings } from "../globalModule/nestMailerModule/registrarionMail/RegMailSettings";
import { baseUrl } from "../main";
import { BadReqTypeException } from "../exception/ClientException";
import { Role } from "../guard/RoleGuard/role.enum";
import { Roles } from "../guard/RoleGuard/roles.decorator";
import { RolesGuard } from "../guard/RoleGuard/roles.guard";
import { sendHtml } from "../helpers/sendHtml";

const authUrlController = "auth";
const confirmRegUrl = "confirmReg";

@Controller(authUrlController)
export class AuthController {
  public currentRepository: UsersRepo;
  private readonly emailTimerMin: number = 15;

  private readonly urlMail: string = `${authUrlController}/${confirmRegUrl}`;

  constructor(readonly persistence: PersistenceService,
              readonly authService: AuthService,
              private readonly mailerService: MailerService
  ) {
    this.currentRepository = persistence.getCurrentRepository(UsersEntity, UsersRepo);
  }

  /**
   * Идентификация пользователя по токену. возвращает емаил и id
   * @param req
   */
  @Get("me")
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  async getMyAccount(@Req() req) {
    return this.authService.identificationMe(req.user);
  }

  /**
   * Идентификация пользователя по email и password.Возвращает токена пользователя
   * @param bodyReq
   * @param response
   */
  @Post("login")
  @UsePipes(new AbstractValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }, {
    body: UsersDto
  }))
  async signIn(@Body() bodyReq: UsersDto,
               @Res({ passthrough: true }) response) {
    const [email, id, giveRole] = await this.currentRepository.findUserByEmailAndPass(
      bodyReq.email, bodyReq.password, { getRole: true });
    return this.authService.signIn(email, id, giveRole);
  }

  /**
   * Регистрация пользователя для работы с сайтом
   * @param body : UsersDto
   */
  @Post("registration")
  @UsePipes(new AbstractValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }, {
    body: UsersDto
  }))
  async registration(@Body() body: UsersDto): Promise<{ message: string }|never> {
    if (!await this.currentRepository.findUserByEmail(body.email)) {
      const link: string = `${baseUrl}/${this.urlMail}/` + (await this.authService.getTemporaryToken(
        body.email, body.password, [Role.User])).access_token;
      let data = {
        message: "Something wrong"
      };
      await this.mailerService
        .sendMail(RegMailSettings(body.email, link))
        .then(() => {
          data.message = `Email has been sent and is valid for ${this.emailTimerMin} minutes`;
        })
        .catch(() => {

          throw new BadReqTypeException('Failed to send email. Perhaps such an email does not exist.')

        });
      return data;
    } else {
      throw new BadReqTypeException("Email already registration");
    }

  }

  /**
   * Подтверждение регистрации пользователя
   * @param token -Токен для завершении регистрации
   */
  @Get(`${confirmRegUrl}/:token`)
  async confirmReg(@Param("token") token: string): Promise<string> | never {
    const tokenProperty: { email: string, password: string, roles: Role[] } = (await this.authService.token(token));
    const newUser: any = { email: tokenProperty.email, password: tokenProperty.password };
    const email = await this.currentRepository.findUserByEmail(
      newUser.email);
    if (email === undefined) {
      const result = this.currentRepository.createNewUser(
        newUser.email, tokenProperty.password, tokenProperty.roles);
      return sendHtml((await result).email);
    } else {
      throw new BadReqTypeException("Email already registration");
    }
  }
}
