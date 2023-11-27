import { AuthService } from "./Auth.service";
import { UsersDto } from "../repository/validate-dto/Auth.dto";
import { PersistenceService } from "../repository";
import { UsersRepo } from "../repository/repos/users.repo.";
import { MailerService } from "@nestjs-modules/mailer";
export declare class AuthController {
    readonly persistence: PersistenceService;
    readonly authService: AuthService;
    private readonly mailerService;
    currentRepository: UsersRepo;
    private readonly emailTimerMin;
    private readonly urlMail;
    constructor(persistence: PersistenceService, authService: AuthService, mailerService: MailerService);
    getMyAccount(req: any): Promise<{
        email: any;
        id: any;
    }>;
    signIn(bodyReq: UsersDto, response: any): Promise<{
        access_token: string;
    }>;
    registration(body: UsersDto): Promise<{
        message: string;
    } | never>;
    confirmReg(token: string): Promise<string> | never;
}
