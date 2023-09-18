import { HttpStatus, ParseFilePipeBuilder } from "@nestjs/common";

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
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
}