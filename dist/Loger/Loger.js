"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MyLogger_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyLogger = void 0;
const common_1 = require("@nestjs/common");
let MyLogger = MyLogger_1 = class MyLogger {
    constructor() {
        this.logger = new common_1.Logger(MyLogger_1.name);
    }
    sendLogMessage(loggerMassage, loggerName) {
        if (loggerName) {
            this.logger = new common_1.Logger(loggerName);
        }
        this.logger.log(loggerMassage ? loggerMassage : "Модуль запущен");
    }
};
exports.MyLogger = MyLogger;
exports.MyLogger = MyLogger = MyLogger_1 = __decorate([
    (0, common_1.Injectable)()
], MyLogger);
//# sourceMappingURL=Loger.js.map