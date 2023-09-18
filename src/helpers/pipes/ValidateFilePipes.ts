import { FileValidator, HttpStatus, ParseFilePipeBuilder } from "@nestjs/common";
// const MAX_UPLOAD_SIZE = 1; // in MB
//
// class MaxFileSize extends FileValidator<{ maxSize: number }>{
//   constructor(options: { maxSize: number }) {
//     super(options)
//   }
//
//   isValid(file: Express.Multer.File): boolean | Promise<boolean> {
//     const in_mb = file.size / 1000000
//     return in_mb <= this.validationOptions.maxSize
//   }
//   buildErrorMessage(): string {
//     return `File uploaded is too big. Max size is (${this.validationOptions.maxSize} MB)`
//   }
// }

export const validateFilePipes=(formatType:string | RegExp, sizeMb:number)=>{
const convertToByte =1000000*sizeMb
  return new ParseFilePipeBuilder()
    // Не защищенный тип  (magick file )
    .addFileTypeValidator({
      fileType: formatType,
    })
    .addMaxSizeValidator({
      maxSize: convertToByte,
      message:`Максимальный размер файла, не должен быть более ${sizeMb}Мб`
    })
    // .addValidator(
    //   new MaxFileSize({
    //     maxSize: MAX_UPLOAD_SIZE
    //   }),
    // )
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
}