import { UsersEntity } from "../entities/users.entity";
import { IsDefined, IsEmail, IsString } from "class-validator";
export class UsersRegistrationDto extends UsersEntity  {
  @IsDefined()
  @IsString()
  @IsEmail()
  public email: string;
}
export class UsersDto extends UsersRegistrationDto  {
  @IsDefined()
  @IsString()
  public password: string ;
}

