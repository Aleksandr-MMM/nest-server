import { BaseClientException } from "./BaseClientException";
import { HttpStatus } from "@nestjs/common";

const ID_NOT_FOUND_MESSAGE = "Id not found";
const UNSUPPORTED_TYPE_STRING = "Property in array must be as string";
const BAD_ATTACHMENTS = "Incorrect request.The file is already in the database"

export class IdNotFoundException extends BaseClientException {
  constructor() {
    super(HttpStatus.NOT_FOUND,ID_NOT_FOUND_MESSAGE)
  }
}

export class UnsupportedTypeException  extends BaseClientException {
  constructor() {
    super(HttpStatus.UNSUPPORTED_MEDIA_TYPE,UNSUPPORTED_TYPE_STRING)
  }
}
export class AttachmentsTypeException  extends BaseClientException {
  constructor() {
    super(HttpStatus.BAD_REQUEST,BAD_ATTACHMENTS)
  }
}
export class BadReqTypeException  extends BaseClientException {
  constructor(addMessage:string) {
    super(HttpStatus.BAD_REQUEST,addMessage)
  }
}
