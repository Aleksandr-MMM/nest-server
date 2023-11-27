"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateConfig_1 = require("../utils/CreateConfig");
const Joi = require("joi");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("mail", () => {
    return (new CreateConfig_1.CreateConfig("/mailerConfig.yml", Joi.object({
        host: Joi.string().required(),
        port: Joi.number().required(),
        secure: Joi.boolean().required(),
        user: Joi.string().required(),
        pass: Joi.string().required(),
    })).getConfig);
});
//# sourceMappingURL=mailerConfig.js.map