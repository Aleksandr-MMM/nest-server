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
exports.AlbumController = void 0;
const common_1 = require("@nestjs/common");
const BaseFactory_controller_1 = require("../../../BaseFactory.controller");
const album_entity_1 = require("../../entities/album.entity");
const Album_repo_1 = require("../../repos/Album.repo");
const index_1 = require("../../index");
const Album_dto_1 = require("../../validate-dto/Album.dto");
const AbstractValidationPipe_1 = require("../../../helpers/pipes/AbstractValidationPipe");
const users_repo_1 = require("../../repos/users.repo.");
const users_entity_1 = require("../../entities/users.entity");
const roles_decorator_1 = require("../../../guard/RoleGuard/roles.decorator");
const role_enum_1 = require("../../../guard/RoleGuard/role.enum");
const roles_guard_1 = require("../../../guard/RoleGuard/roles.guard");
let AlbumController = class AlbumController extends (0, BaseFactory_controller_1.FactoryCRUDController)(album_entity_1.AlbumEntity, Album_repo_1.AlbumRepo) {
    constructor(persistence) {
        super(persistence);
        this.persistence = persistence;
        this.addNewAlbumProperty = { trackList: [] };
        this.userRepository = persistence.getCurrentRepository(users_entity_1.UsersEntity, users_repo_1.UsersRepo);
        this.albumRepository = persistence.getCurrentRepository(album_entity_1.AlbumEntity, Album_repo_1.AlbumRepo);
    }
    async createDocument(body, req) {
        const newAlbum = await this.albumRepository.storeDocument(body, this.addNewAlbumProperty);
        return await this.userRepository.addAlbumForUser(req.user.id, newAlbum.id, body.albumName);
    }
    async pushTrackInDocument(id, body) {
        return await this.albumRepository.addTrackInAlbum(body.trackList, id);
    }
    async delTrackInDocument(id, req, body) {
        const checkAlbumId = await this.userRepository.checkIsMyAlbum(req.user.id, id);
        return await this.albumRepository.delTrackInAlbum(body, checkAlbumId);
    }
    async getMyAlbums(req) {
        const albums = (await this.userRepository.getById(req.user.id)).albumList.map(album => album.id);
        return await this.albumRepository.findAlbumsByIds(albums);
    }
};
exports.AlbumController = AlbumController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }, {
        body: Album_dto_1.AlbumPostDto
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [album_entity_1.AlbumEntity, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "createDocument", null);
__decorate([
    (0, common_1.Put)("/track/:id"),
    (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }, { body: Album_dto_1.AlbumPutDto })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "pushTrackInDocument", null);
__decorate([
    (0, common_1.Delete)("/track/:id"),
    (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }, { body: Album_dto_1.AlbumPutDto })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, album_entity_1.AlbumEntity]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "delTrackInDocument", null);
__decorate([
    (0, common_1.Get)("/myAlbums"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AlbumController.prototype, "getMyAlbums", null);
exports.AlbumController = AlbumController = __decorate([
    (0, common_1.Controller)("/album"),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.User),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [index_1.PersistenceService])
], AlbumController);
//# sourceMappingURL=album.controller.js.map