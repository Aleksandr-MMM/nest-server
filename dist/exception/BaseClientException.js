"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClientException = void 0;
const common_1 = require("@nestjs/common");
class BaseClientException extends common_1.HttpException {
    constructor(statusCode, message) {
        super({ message: message }, statusCode);
    }
}
exports.BaseClientException = BaseClientException;
//# sourceMappingURL=BaseClientException.js.map