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
exports.AbstractValidationPipe = void 0;
const common_1 = require("@nestjs/common");
let AbstractValidationPipe = class AbstractValidationPipe extends common_1.ValidationPipe {
    constructor(options, targetTypes) {
        super(options);
        this.targetTypes = targetTypes;
    }
    async transform(value, metadata) {
        const targetType = this.targetTypes[metadata.type];
        if (!targetType) {
            return super.transform(value, metadata);
        }
        return super.transform(value, Object.assign(Object.assign({}, metadata), { metatype: targetType }));
    }
};
exports.AbstractValidationPipe = AbstractValidationPipe;
exports.AbstractValidationPipe = AbstractValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object])
], AbstractValidationPipe);
//# sourceMappingURL=AbstractValidationPipe.js.map