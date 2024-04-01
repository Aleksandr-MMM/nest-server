import { BaseEntity } from './base.entity';
import { Role } from "../../guard/RoleGuard/role.enum";
import { AlbumEntity } from "./album.entity";

export class UsersEntity extends BaseEntity {
  get  collectionName(): string {
    return 'user';
  }
  public email: string
  public nickName:string;
  public albumList:AlbumEntity[];
  public status : string|null;
  public friends : string[];
  public subscribe : string[];
  public protected:{password:string,roles:Role[]}
}
