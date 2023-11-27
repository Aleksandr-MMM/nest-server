import { ArrayMaxSize, ArrayNotEmpty, ArrayUnique, IsArray, IsDefined, IsString } from "class-validator";
import { UnsupportedTypeException } from "../../exception/ClientException";
import { AlbumEntity } from "../entities/album.entity";

export class AlbumPostDto extends AlbumEntity {
  @IsDefined()
  @IsString()
  albumName: string;
}

export class AlbumPutDto extends AlbumEntity {
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @ArrayUnique((el)=>{
    if(typeof el === 'string' || el instanceof String){
      return el
    }
    else{
       throw new UnsupportedTypeException()
    }
  })
  trackList: Array<string>;
}

