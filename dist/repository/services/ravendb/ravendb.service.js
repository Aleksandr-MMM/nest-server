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
var RavendbService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RavendbService = void 0;
const common_1 = require("@nestjs/common");
const ravendb_1 = require("ravendb");
const config_1 = require("@nestjs/config");
const getDocumentStore_1 = require("../../../helpers/getDocumentStore");
const Loger_1 = require("../../../Loger/Loger");
let RavendbService = RavendbService_1 = class RavendbService {
    tryConnectingStore(store, tryConnectingCount, logger) {
        for (let i = 1;; i++) {
            if (logger) {
                logger.sendLogMessage(`Пытаюсь пожключиться к базе данных ${i} ...`, RavendbService_1.name);
            }
            try {
                const session = store.openSession();
                const objects = session.query({}).noTracking().first();
                if (objects) {
                    if (logger) {
                        logger.sendLogMessage(`Произошло подключение к базе данных `, RavendbService_1.name);
                    }
                    break;
                }
            }
            catch (err) {
                if (i >= tryConnectingCount) {
                    throw Error("Проюлемма с подключением к базе данных к базе данных.");
                }
            }
        }
    }
    constructor(config, logger) {
        this.config = config;
        this.store = (0, getDocumentStore_1.getDocumentStore)(config);
        this.store.initialize();
        this.tryConnectingStore(this.store, 3, logger);
    }
    async storeDocument(document) {
        const session = this.store.openSession();
        await session.store(document);
        await session.saveChanges();
        session.dispose();
        return document;
    }
    async updateCollection(databaseName, entityName, entityValue) {
        await this.store.operations.send(new ravendb_1.PatchByQueryOperation(`from '${databaseName}' ` + `update ` + `{this.${entityName}=${entityValue}}`));
        return "success";
    }
};
exports.RavendbService = RavendbService;
exports.RavendbService = RavendbService = RavendbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, Loger_1.MyLogger])
], RavendbService);
//# sourceMappingURL=ravendb.service.js.map