"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConfig = void 0;
const yaml = require("js-yaml");
const fs_1 = require("fs");
const path_1 = require("path");
class CreateConfig {
    constructor(filePath, schema) {
        this.filePath = filePath;
        this.baseFolderPath = "./configSettings";
        const [error, value] = this.validateConfig(schema, yaml.load((0, fs_1.readFileSync)((0, path_1.join)(this.baseFolderPath, filePath), "utf8")));
        this.validateSuccessResult = this.checkError(error, value);
    }
    validateConfig(schema, values) {
        const { error, value } = schema.validate(values, { abortEarly: false });
        return [error, value];
    }
    checkError(error, value) {
        if (error) {
            throw new Error(`Validation failed - Is there an environment variable missing?
        ${error.message}`);
        }
        return value;
    }
    get getConfig() {
        return this.validateSuccessResult;
    }
}
exports.CreateConfig = CreateConfig;
//# sourceMappingURL=CreateConfig.js.map