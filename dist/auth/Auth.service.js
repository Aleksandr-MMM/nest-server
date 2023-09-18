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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./constants");
let AuthService = class AuthService {
    payloadRemove(obj) {
        return { email: obj === null || obj === void 0 ? void 0 : obj.email, id: obj === null || obj === void 0 ? void 0 : obj.id };
    }
    ;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async getToken(obj) {
        const payload = Object.assign({}, obj);
        return {
            access_token: await this.jwtService.signAsync(payload)
        };
    }
    identificationMe(user) {
        return this.payloadRemove(user);
    }
    async signIn(email, id) {
        return await this.getToken({ email: email, id: id });
    }
    async getTemporaryToken(email, pass) {
        return await this.getToken({ email: email, password: pass });
    }
    async token(token) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: constants_1.jwtConstants.secret
            });
        }
        catch (_a) {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=Auth.service.js.map