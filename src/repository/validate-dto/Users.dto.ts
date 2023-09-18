import { TrackEntity } from "../entities";
import { IsDefined, IsOptional, IsString } from "class-validator";
import { UsersEntity } from "../entities/users.entity";

// export class UsersDto extends UsersEntity  {
//   @IsDefined()
//   @IsString()
//   nickName: string| null;
//   @IsOptional()
//   @IsString()
//   status: string | null;
// }
// export class TrackFileDto extends TrackEntity{
//   @IsDefined()
//   @IsString()
//   trackName: string| null;
//   @IsDefined()
//   @IsString()
//   author: string | null;
// }