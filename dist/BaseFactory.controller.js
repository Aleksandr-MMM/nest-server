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
exports.FactoryCRUDController = void 0;
const repository_1 = require("./repository");
const common_1 = require("@nestjs/common");
const AbstractValidationPipe_1 = require("./helpers/pipes/AbstractValidationPipe");
const roles_guard_1 = require("./guard/RoleGuard/roles.guard");
const roles_decorator_1 = require("./guard/RoleGuard/roles.decorator");
const role_enum_1 = require("./guard/RoleGuard/role.enum");
function FactoryCRUDController(entity, repo, options) {
    var _a, _b;
    let BaseCRUDController = class BaseCRUDController {
        constructor(persistence) {
            this.persistence = persistence;
            this.currentRepository = persistence.getCurrentRepository(entity, repo);
        }
        async getDocument() {
            return await this.currentRepository.retrieveDocuments();
        }
        async isDocumentExists(id) {
            return await this.currentRepository.documentExists(id);
        }
        async getDocumentById(id) {
            return await this.currentRepository.getById(id);
        }
        async createDocument(body) {
            var _a;
            return await this.currentRepository.storeDocument(body, (_a = options === null || options === void 0 ? void 0 : options.postOptions) === null || _a === void 0 ? void 0 : _a.addProperty);
        }
        async updateDocument(id, body) {
            return await this.currentRepository.updateDocument(body, id);
        }
        async deleteById(id) {
            return await this.currentRepository.deleteById(id);
        }
    };
    __decorate([
        (0, common_1.Get)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], BaseCRUDController.prototype, "getDocument", null);
    __decorate([
        (0, common_1.Get)("/exist/:id"),
        __param(0, (0, common_1.Param)("id")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseCRUDController.prototype, "isDocumentExists", null);
    __decorate([
        (0, common_1.Get)(":id"),
        __param(0, (0, common_1.Param)("id")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseCRUDController.prototype, "getDocumentById", null);
    __decorate([
        (0, common_1.Post)(),
        (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        }, {
            body: (_a = options === null || options === void 0 ? void 0 : options.postOptions) === null || _a === void 0 ? void 0 : _a.DTO
        })),
        __param(0, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BaseCRUDController.prototype, "createDocument", null);
    __decorate([
        (0, common_1.Put)(":id"),
        (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        }, { body: (_b = options === null || options === void 0 ? void 0 : options.putOptions) === null || _b === void 0 ? void 0 : _b.DTO })),
        __param(0, (0, common_1.Param)("id")),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], BaseCRUDController.prototype, "updateDocument", null);
    __decorate([
        (0, common_1.Delete)(":id"),
        __param(0, (0, common_1.Param)("id")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseCRUDController.prototype, "deleteById", null);
    BaseCRUDController = __decorate([
        (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
        (0, roles_decorator_1.Roles)(role_enum_1.Role.User),
        (0, common_1.Controller)(),
        __metadata("design:paramtypes", [repository_1.PersistenceService])
    ], BaseCRUDController);
    return BaseCRUDController;
}
exports.FactoryCRUDController = FactoryCRUDController;
//# sourceMappingURL=BaseFactory.controller.js.map