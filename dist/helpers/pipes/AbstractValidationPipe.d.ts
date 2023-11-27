import { ArgumentMetadata, Type, ValidationPipe, ValidationPipeOptions } from "@nestjs/common";
export declare class AbstractValidationPipe extends ValidationPipe {
    private readonly targetTypes;
    constructor(options: ValidationPipeOptions, targetTypes: {
        body?: Type;
        query?: Type;
        param?: Type;
        custom?: Type;
    });
    private checkEmptyObj;
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}
