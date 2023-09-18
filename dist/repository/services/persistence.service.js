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
var PersistenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const entities_1 = require("../entities");
const getDocumentStore_1 = require("../../helpers/getDocumentStore");
let PersistenceService = PersistenceService_1 = class PersistenceService {
    async executeIndexes() {
    }
    constructor(config) {
        this.config = config;
        this.descriptorsByCollection = {};
        this.collectionsName = [];
        this.descriptorsByName = {};
        this.documentInterfaces = {};
        this.logger = new common_1.Logger(PersistenceService_1.name);
        this.documentStore = (0, getDocumentStore_1.getDocumentStore)(config);
        entities_1.entityDescriptor.forEach((descriptor) => {
            this.documentStore.conventions.registerEntityType(descriptor.class, descriptor.collection);
            this.collectionsName.push(descriptor.collection);
            if (this.descriptorsByCollection[descriptor.collection]) {
                throw `Collection name ${descriptor.collection} already in use`;
            }
            else {
                this.descriptorsByCollection[descriptor.collection] = descriptor;
                this.descriptorsByName[descriptor.name] = descriptor;
            }
        });
        this.documentStore.initialize();
        this.executeIndexes().then(() => this.logger.log('RavenDB index execution complete'));
    }
    getCurrentRepository(Entity, newRepository) {
        if (!this.documentInterfaces[Entity.name]) {
            this.documentInterfaces[Entity.name] = new newRepository(this.documentStore, this.descriptorsByName[Entity.name]);
        }
        return this.documentInterfaces[Entity.name];
    }
};
exports.PersistenceService = PersistenceService;
exports.PersistenceService = PersistenceService = PersistenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PersistenceService);
//# sourceMappingURL=persistence.service.js.map