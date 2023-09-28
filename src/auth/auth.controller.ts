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
import { AuthGuard } from "../guard/auth.guard";
import { MailerService } from "@nestjs-modules/mailer";
import { RegMailSettings } from "../globalModule/nestMailerModule/registrarionMail/RegMailSettings";
import { baseUrl } from "../main";
import { BadReqTypeException } from "../exception/ClientException";
import { Role } from "../guard/RoleGuard/role.enum";

const authUrlController = "auth";
const confirmRegUrl="confirmReg";

@Controller(authUrlController)
export class AuthController {
  public currentRepository;
  private readonly emailTimerMin:number=15;

  private readonly urlMail:string=`${authUrlController}/${confirmRegUrl}`;

  constructor(readonly persistence: PersistenceService,
              readonly authService: AuthService,
              private readonly mailerService: MailerService
  ) {
    this.currentRepository = persistence.getCurrentRepository(UsersEntity, UsersRepo);
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async getMyAccount(@Req() req) {
    return this.authService.identificationMe(req.user);
  }

  @Post("login")
  @UsePipes(new AbstractValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }, {
    body: UsersDto
  }))
  async signIn(@Body() bodyReq: UsersDto,
               @Res({ passthrough: true }) response) {
    const [email, id,giveRole] = await this.currentRepository.findUserByEmailAndPass(
      bodyReq.email, bodyReq.password,{getRole:true});
    return this.authService.signIn(email, id,giveRole);
  }

  @Post("registration")
  // @Throttle({ default: { limit: 1, ttl: minutes(emailTimerMin) } })
  @UsePipes(new AbstractValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }, {
    body: UsersDto
  }))
  async registration(@Body() body: UsersDto) {
    if (!await this.currentRepository.findUserByEmail(body.email)) {
      const link: string = `${baseUrl}/${this.urlMail}/` + (await this.authService.getTemporaryToken(
        body.email, body.password,[Role.User])).access_token;
      let response = "Something wrong";

      await this.mailerService
        .sendMail(RegMailSettings(body.email, link))
        .then(() => {
          response = `Email has been sent and is valid for ${this.emailTimerMin} minutes`;
        })
        .catch((e) => {
          console.log(e)
        });
      return response;
    } else {
      throw new BadReqTypeException("Email already registration");
    }

  }

  @Get(`${confirmRegUrl}/:token`)
  async confirmReg(@Param("token") token: string) {

    const tokenProperty: { email: string, password: string, roles: Role[] } = (await this.authService.token(token));

    const newUser: any = { email: tokenProperty.email, password: tokenProperty.password };
    const email = await this.currentRepository.findUserByEmail(
      newUser.email);
    if (email === undefined) {
      return this.currentRepository.createNewUser(
        newUser.email, tokenProperty.password, tokenProperty.roles);
    } else {
      throw new BadReqTypeException("Email already registration");
    }
  }
}
