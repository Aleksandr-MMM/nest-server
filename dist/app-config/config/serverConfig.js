"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateConfig_1 = require("../utils/CreateConfig");
const Joi = require("joi");
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)("server", () => {
    return (new CreateConfig_1.CreateConfig("/serverConfig.yml", Joi.object({
        environment: Joi.string().required().valid("development", "production"),
        names: Joi.array().required()
    })).getConfig);
});
//# sourceMappingURL=serverConfig.js.map