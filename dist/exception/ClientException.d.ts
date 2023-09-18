import { BaseClientException } from "./BaseClientException";
export declare class IdNotFoundException extends BaseClientException {
    constructor();
}
export declare class UnsupportedTypeException extends BaseClientException {
    constructor();
}
export declare class AttachmentsTypeException extends BaseClientException {
    constructor();
}
export declare class BadReqTypeException extends BaseClientException {
    constructor(addMessage: string);
}
