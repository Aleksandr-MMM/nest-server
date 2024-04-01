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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../index");
const users_repo_1 = require("../../repos/users.repo.");
const users_entity_1 = require("../../entities/users.entity");
const ClientException_1 = require("../../../exception/ClientException");
const platform_express_1 = require("@nestjs/platform-express");
const ValidateFilePipes_1 = require("../../../helpers/pipes/ValidateFilePipes");
const roles_decorator_1 = require("../../../guard/RoleGuard/roles.decorator");
const role_enum_1 = require("../../../guard/RoleGuard/role.enum");
const roles_guard_1 = require("../../../guard/RoleGuard/roles.guard");
const AbstractValidationPipe_1 = require("../../../helpers/pipes/AbstractValidationPipe");
const Users_dto_1 = require("../../validate-dto/Users.dto");
let UsersController = class UsersController {
    constructor(persistence) {
        this.persistence = persistence;
        this.currentRepository = persistence.getCurrentRepository(users_entity_1.UsersEntity, users_repo_1.UsersRepo);
    }
    async getUsers(req) {
        const users = await this.currentRepository.retrieveDocuments(10, 0, req.user.id);
        return this.currentRepository.deleteUsersEmailAndProtectedInfo(users);
    }
    async getUserById(id) {
        const foundUser = await this.currentRepository.getById(id);
        return this.currentRepository.deleteEmailAndProtectedInfo(foundUser);
    }
    async putUserProperty(body, req) {
        const updatedUser = await this.currentRepository.updateProfile(req.user.id, body);
        return this.currentRepository.deleteEmailAndProtectedInfo(updatedUser);
    }
    async subscribeUser(req, userId) {
        if (await this.currentRepository.documentExists(userId)) {
            return this.currentRepository.subscribeUser(req.user.id, userId);
        }
        else {
            throw new ClientException_1.IdNotFoundException();
        }
    }
    async unSubscribeUser(req, userId) {
        return this.currentRepository.unSubscribeUser(req.user.id, userId);
    }
    async addFriend(req, userId) {
        if (await this.currentRepository.documentExists(userId)) {
            return this.currentRepository.addFriendList(req.user.id, userId);
        }
        else {
            throw new ClientException_1.IdNotFoundException();
        }
    }
    async unFriend(req, userId) {
        return this.currentRepository.unFriend(req.user.id, userId);
    }
    async getPhoto(userId, res) {
        return this.currentRepository.getAttachment(userId, "jpeg", res);
    }
    async addPhoto(file, req) {
        return this.currentRepository.addAttachment(req.user.id, file, { formatFile: 'jpeg', contentType: "image/jpeg" });
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)("/updateProperty"),
    (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }, { body: Users_dto_1.UsersDto })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Users_dto_1.UsersDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "putUserProperty", null);
__decorate([
    (0, common_1.Put)("/subscribe/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "subscribeUser", null);
__decorate([
    (0, common_1.Delete)("/unSubscribe/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unSubscribeUser", null);
__decorate([
    (0, common_1.Put)("/addFriend/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Delete)("/unFriend/:id"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "unFriend", null);
__decorate([
    (0, common_1.Get)("/photo/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPhoto", null);
__decorate([
    (0, common_1.Post)("/addPhoto"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("photo", { storage: null })),
    __param(0, (0, common_1.UploadedFile)((0, ValidateFilePipes_1.validateFilePipes)(/(gif|jpe?g|tiff?|png|webp|bmp)$/, 5))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addPhoto", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)("/user"),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.User, role_enum_1.Role.Admin),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [index_1.PersistenceService])
], UsersController);
//# sourceMappingURL=users.controller.js.map