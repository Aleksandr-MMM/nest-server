import { ObjectSchema, ValidationError } from "joi";
export declare class CreateConfig<T> {
    filePath: string;
    private readonly baseFolderPath;
    private readonly validateSuccessResult;
    constructor(filePath: string, schema: ObjectSchema<T>);
    protected validateConfig(schema: ObjectSchema<T>, values: T): [ValidationError, any];
    protected checkError(error: ValidationError, value: any): Record<string, any>;
    get getConfig(): any;
}
