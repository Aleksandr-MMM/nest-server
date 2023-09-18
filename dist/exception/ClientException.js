"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadReqTypeException = exports.AttachmentsTypeException = exports.UnsupportedTypeException = exports.IdNotFoundException = void 0;
const BaseClientException_1 = require("./BaseClientException");
const common_1 = require("@nestjs/common");
const ID_NOT_FOUND_MESSAGE = "Id not found";
const UNSUPPORTED_TYPE_STRING = "Property in array must be as string";
const BAD_ATTACHMENTS = "Incorrect request.The file is already in the database";
class IdNotFoundException extends BaseClientException_1.BaseClientException {
    constructor() {
        super(common_1.HttpStatus.NOT_FOUND, ID_NOT_FOUND_MESSAGE);
    }
}
exports.IdNotFoundException = IdNotFoundException;
class UnsupportedTypeException extends BaseClientException_1.BaseClientException {
    constructor() {
        super(common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE, UNSUPPORTED_TYPE_STRING);
    }
}
exports.UnsupportedTypeException = UnsupportedTypeException;
class AttachmentsTypeException extends BaseClientException_1.BaseClientException {
    constructor() {
        super(common_1.HttpStatus.BAD_REQUEST, BAD_ATTACHMENTS);
    }
}
exports.AttachmentsTypeException = AttachmentsTypeException;
class BadReqTypeException extends BaseClientException_1.BaseClientException {
    constructor(addMessage) {
        super(common_1.HttpStatus.BAD_REQUEST, addMessage);
    }
}
exports.BadReqTypeException = BadReqTypeException;
//# sourceMappingURL=ClientException.js.map