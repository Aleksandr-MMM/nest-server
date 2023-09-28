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
exports.TrackController = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../index");
const BaseFactory_controller_1 = require("../../../BaseFactory.controller");
const Track_dto_1 = require("../../validate-dto/Track.dto");
const platform_express_1 = require("@nestjs/platform-express");
const ValidateFilePipes_1 = require("../../../helpers/pipes/ValidateFilePipes");
const AbstractValidationPipe_1 = require("../../../helpers/pipes/AbstractValidationPipe");
const roles_decorator_1 = require("../../../guard/RoleGuard/roles.decorator");
const role_enum_1 = require("../../../guard/RoleGuard/role.enum");
const roles_guard_1 = require("../../../guard/RoleGuard/roles.guard");
let TrackController = class TrackController extends (0, BaseFactory_controller_1.FactoryCRUDController)(index_1.TrackEntity, index_1.TrackRepo, {
    postOptions: {
        DTO: Track_dto_1.TrackDto
    },
    putOptions: {
        DTO: Track_dto_1.TrackDto
    }
}) {
    constructor(persistence) {
        super(persistence);
        this.persistence = persistence;
    }
    async uploadFile(file, trackId, body) {
        body = this.currentRepository.checkPropForUndefinedAndSetNull(body, 'trackName', 'author');
        const createNewTrackProperty = this.currentRepository.storeDocument(body);
        return this.currentRepository.addAttachment((await createNewTrackProperty).id, file);
    }
};
exports.TrackController = TrackController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("music", { storage: null })),
    (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }, {
        body: Track_dto_1.TrackDto
    })),
    __param(0, (0, common_1.UploadedFile)((0, ValidateFilePipes_1.validateFilePipes)(/(mpeg)$/, 10))),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Track_dto_1.TrackDto]),
    __metadata("design:returntype", Promise)
], TrackController.prototype, "uploadFile", null);
exports.TrackController = TrackController = __decorate([
    (0, common_1.Controller)("/track"),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.User),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [index_1.PersistenceService])
], TrackController);
//# sourceMappingURL=track.controller.js.map