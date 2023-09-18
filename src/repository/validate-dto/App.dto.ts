import { IsDefined, IsIn, IsString, Length } from "class-validator";
import { allCollections } from "../entities";

export class AppDto {

  @IsDefined()
  @IsString()
  @IsIn(allCollections)
  databaseName: string;
  @IsDefined()
  @IsString()
  @Length(1, 100)
  entityName: string;
  @IsDefined()
  @IsString()
  @IsIn(['[]','{}',"''",'null','true','false'])
  entityValue: string;
}