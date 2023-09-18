import { BaseEntity } from './base.entity';

export class UsersEntity extends BaseEntity {
  get  collectionName(): string {
    return 'user';
  }
  public email: string
  public password: string
  public nikName:string;
  public albumList:string[];
  public status : string|null;
  public photo : string|null;
  public friends : string[];
  public subscribe : string[];

}
