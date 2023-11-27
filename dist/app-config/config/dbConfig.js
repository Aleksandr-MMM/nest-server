"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateConfig_1 = require("../utils/CreateConfig");
const Joi = require("joi");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("db", () => {
    return (new CreateConfig_1.CreateConfig("/dbConfig.yml", Joi.object({
        raven: {
            database: Joi.string().required(),
            url: Joi.string().required(),
            certificate: Joi.string(),
            passphrase: Joi.string(),
        }
    })).getConfig);
});
//# sourceMappingURL=dbConfig.js.map