import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes
} from "@nestjs/common";
import { AuthService } from "./Auth.service";
import { UsersDto, UsersRegistrationDto } from "../repository/validate-dto/Auth.dto";
import { AbstractValidationPipe } from "../helpers/pipes/AbstractValidationPipe";
import { PersistenceService } from "../repository";
import { UsersEntity } from "../repository/entities/users.entity";
import { UsersRepo } from "../repository/repos/users.repo.";
import { AuthGuard } from "../guard/auth.guard";
import { MailerService } from "@nestjs-modules/mailer";
import { RegMailSettings } from "../globalModule/nestMailerModule/registrarionMail/RegMailSettings";
import { baseUrl } from "../main";
import { BadReqTypeException } from "../exception/ClientException";

const authUrlController = "auth";
const confirmReg = "confirmReg";
const urlMail = `${authUrlController}/${confirmReg}`;

@Controller(authUrlController)
export class AuthController {
  public currentRepository;

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
  @UseInterceptors(AuthGuard)
  async signIn(@Body() bodyReq: UsersDto,
               @Res({ passthrough: true }) response) {
    const [email, id] = await this.currentRepository.findUserByEmailAndPass(
      bodyReq.email, bodyReq.password);
    return this.authService.signIn(email, id);
  }

  @Post("registration")
  @UsePipes(new AbstractValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }, {
    body: UsersDto
  }))
  async registration(@Body() body: UsersRegistrationDto) {
    const link: string = `${baseUrl}/${urlMail}/` + (await this.authService.getTemporaryToken(
      body.email, body.password)).access_token;
    let response = "Something wrong";
    await this.mailerService
      .sendMail(RegMailSettings(body.email, link))
      .then(() => {
        response = "Email send";
      })
      .catch((e) => {
        console.log(e)
      });
    return response;
  }

  @Get(`${confirmReg}/:token`)
  async confirmReg(@Param("token") token: string) {
    const tokenProperty: { email: string, password: string } = (await this.authService.token(token));
    const newUser:any = { email: tokenProperty.email, password: tokenProperty.password };
    const email = await this.currentRepository.findUserByEmail(
      newUser.email);
    if(email===undefined){
      return this.currentRepository.createNewUser(newUser);
    }
    else {
      throw new BadReqTypeException('Email already registration')
    }
  }
}
