"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestMailerModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
let NestMailerModule = class NestMailerModule {
};
exports.NestMailerModule = NestMailerModule;
exports.NestMailerModule = NestMailerModule = __decorate([
    (0, common_1.Module)({
        imports: [mailer_1.MailerModule.forRoot({
                transport: {
                    host: "smtp.mail.ru",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "virus_2010-2009@mail.ru",
                        pass: "HKNLwAsXvzbWpXX80gUS"
                    }
                },
                defaults: {
                    from: "\"music petProject\" <virus_2010-2009@mail.ru>"
                },
                template: {
                    dir: __dirname + "/templates",
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            })
        ]
    })
], NestMailerModule);
//# sourceMappingURL=NestMailer.module.js.map