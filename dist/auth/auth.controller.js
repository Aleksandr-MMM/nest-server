"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const Auth_service_1 = require("./Auth.service");
const Auth_dto_1 = require("../repository/validate-dto/Auth.dto");
const AbstractValidationPipe_1 = require("../helpers/pipes/AbstractValidationPipe");
const repository_1 = require("../repository");
const users_entity_1 = require("../repository/entities/users.entity");
const users_repo_1 = require("../repository/repos/users.repo.");
const auth_guard_1 = require("../guard/auth.guard");
const mailer_1 = require("@nestjs-modules/mailer");
const RegMailSettings_1 = require("../globalModule/nestMailerModule/registrarionMail/RegMailSettings");
const main_1 = require("../main");
const ClientException_1 = require("../exception/ClientException");
const role_enum_1 = require("../guard/RoleGuard/role.enum");
const authUrlController = "auth";
const confirmRegUrl = "confirmReg";
let AuthController = class AuthController {
    constructor(persistence, authService, mailerService) {
        this.persistence = persistence;
        this.authService = authService;
        this.mailerService = mailerService;
        this.emailTimerMin = 15;
        this.urlMail = `${authUrlController}/${confirmRegUrl}`;
        this.currentRepository = persistence.getCurrentRepository(users_entity_1.UsersEntity, users_repo_1.UsersRepo);
    }
    async getMyAccount(req) {
        return this.authService.identificationMe(req.user);
    }
    async signIn(bodyReq, response) {
        const [email, id, giveRole] = await this.currentRepository.findUserByEmailAndPass(bodyReq.email, bodyReq.password, { getRole: true });
        return this.authService.signIn(email, id, giveRole);
    }
    async registration(body) {
        if (!await this.currentRepository.findUserByEmail(body.email)) {
            const link = `${main_1.baseUrl}/${this.urlMail}/` + (await this.authService.getTemporaryToken(body.email, body.password, [role_enum_1.Role.User])).access_token;
            let response = "Something wrong";
            await this.mailerService
                .sendMail((0, RegMailSettings_1.RegMailSettings)(body.email, link))
                .then(() => {
                response = `Email has been sent and is valid for ${this.emailTimerMin} minutes`;
            })
                .catch((e) => {
                console.log(e);
            });
            return response;
        }
        else {
            throw new ClientException_1.BadReqTypeException("Email already registration");
        }
    }
    async confirmReg(token) {
        const tokenProperty = (await this.authService.token(token));
        const newUser = { email: tokenProperty.email, password: tokenProperty.password };
        const email = await this.currentRepository.findUserByEmail(newUser.email);
        if (email === undefined) {
            return this.currentRepository.createNewUser(newUser.email, tokenProperty.password, tokenProperty.roles);
        }
        else {
            throw new ClientException_1.BadReqTypeException("Email already registration");
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMyAccount", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }, {
        body: Auth_dto_1.UsersDto
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Auth_dto_1.UsersDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, common_1.Post)("registration"),
    (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }, {
        body: Auth_dto_1.UsersDto
    })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Auth_dto_1.UsersDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registration", null);
__decorate([
    (0, common_1.Get)(`${confirmRegUrl}/:token`),
    __param(0, (0, common_1.Param)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmReg", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)(authUrlController),
    __metadata("design:paramtypes", [repository_1.PersistenceService,
        Auth_service_1.AuthService,
        mailer_1.MailerService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map