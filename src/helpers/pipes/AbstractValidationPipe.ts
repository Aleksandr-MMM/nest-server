import { ArgumentMetadata, Injectable, Type, ValidationPipe, ValidationPipeOptions } from "@nestjs/common";
import { isEmptyObj } from "../checkEmptyObj";
import { BadReqTypeException } from "../../exception/ClientException";

@Injectable()
export class AbstractValidationPipe extends ValidationPipe {
  constructor(
    options: ValidationPipeOptions,
    private readonly targetTypes: {
      body?: Type;
      query?: Type;
      param?: Type;
      custom?: Type;
    },
  ) {
    super(options);
  }
  // private checkEmptyObj(value:any){
  //   isEmptyObj(value)
  // }
  async transform(value: any, metadata: ArgumentMetadata) {
    if(isEmptyObj(value)){
      throw new BadReqTypeException('body is empty');
    }
    const targetType = this.targetTypes[metadata.type];
    if (!targetType) {
      return super.transform(value, metadata);
    }

    return super.transform(value, { ...metadata, metatype: targetType });
  }

}