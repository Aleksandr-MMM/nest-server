import { UsersEntity } from "../entities/users.entity";
import { IsDefined, IsOptional, IsString } from "class-validator";

export class UsersDto extends UsersEntity  {
  @IsOptional()
  @IsDefined()
  @IsString()
  nickName: string;
  @IsOptional()
  @IsDefined()
  @IsString()
  status: string;
}
