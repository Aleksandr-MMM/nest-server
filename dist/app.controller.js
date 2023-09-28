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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ravendb_service_1 = require("./ravendb/ravendb.service");
const AbstractValidationPipe_1 = require("./helpers/pipes/AbstractValidationPipe");
const App_dto_1 = require("./repository/validate-dto/App.dto");
const roles_decorator_1 = require("./guard/RoleGuard/roles.decorator");
const role_enum_1 = require("./guard/RoleGuard/role.enum");
const roles_guard_1 = require("./guard/RoleGuard/roles.guard");
let AppController = class AppController {
    constructor(ravenService, config) {
        this.ravenService = ravenService;
        this.config = config;
    }
    async getEntities() {
        return 'await this.ravenService.listDocuments();';
    }
    async createEntity(body) {
        return await this.ravenService.storeDocument(body);
    }
    async updateCollection(body) {
        return await this.ravenService.updateCollection(body.databaseName, body.entityName, body.entityValue);
    }
    getConfig() {
        const server = this.config.get('server', 'Not found');
        return { server };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('entities'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getEntities", null);
__decorate([
    (0, common_1.Post)('entities'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createEntity", null);
__decorate([
    (0, common_1.Put)('addInCollection'),
    (0, common_1.UsePipes)(new AbstractValidationPipe_1.AbstractValidationPipe({ whitelist: true,
        forbidNonWhitelisted: true }, {
        body: App_dto_1.AppDto
    })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [App_dto_1.AppDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateCollection", null);
__decorate([
    (0, common_1.Get)('config'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], AppController.prototype, "getConfig", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('app'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ravendb_service_1.RavendbService,
        config_1.ConfigService])
], AppController);
//# sourceMappingURL=app.controller.js.map