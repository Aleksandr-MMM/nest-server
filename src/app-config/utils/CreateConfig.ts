import { ObjectSchema, ValidationError } from "joi";
import * as yaml from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Валидация конфигурации
 */
export class CreateConfig<T> {

  private readonly baseFolderPath: string = "./configSettings";
  private readonly validateSuccessResult;

  constructor(public filePath: string, schema: ObjectSchema<T>) {
    const [error, value] = this.validateConfig(schema,
      yaml.load(readFileSync(join(this.baseFolderPath, filePath),
        "utf8")) as T);
    this.validateSuccessResult = this.checkError(error, value);
  }

  protected validateConfig(schema: ObjectSchema<T>, values: T)
    : [ValidationError, any] {
    const { error, value } = schema.validate(values, { abortEarly: false });
    return [error, value];
  }

  protected checkError(error: ValidationError, value: any): Record<string, any> {
    // If the validation is invalid, "error" is assigned a
    // ValidationError object providing more information.
    if (error) {
      throw new Error(
        `Validation failed - Is there an environment variable missing?
        ${error.message}`
      );
    }
    // If the validation is valid, then the "error" will be
    // undefined and this will return successfully.
    return value as Record<string, any>;
  }

  public get getConfig() {
    return this.validateSuccessResult;
  }
}