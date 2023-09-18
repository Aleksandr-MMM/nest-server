"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFilePipes = void 0;
const common_1 = require("@nestjs/common");
const validateFilePipes = (formatType, sizeMb) => {
    const convertToByte = 1000000 * sizeMb;
    return new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: formatType,
    })
        .addMaxSizeValidator({
        maxSize: convertToByte,
        message: `Максимальный размер файла, не должен быть более ${sizeMb}Мб`
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY
    });
};
exports.validateFilePipes = validateFilePipes;
//# sourceMappingURL=ValidateFilePipes.js.map