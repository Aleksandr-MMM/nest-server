import { BaseEntity } from './base.entity';
import { Role } from "../../guard/RoleGuard/role.enum";
import { AlbumEntity } from "./album.entity";
export declare class UsersEntity extends BaseEntity {
    get collectionName(): string;
    email: string;
    nickName: string;
    albumList: AlbumEntity[];
    status: string | null;
    friends: string[];
    subscribe: string[];
    protected: {
        password: string;
        roles: Role[];
    };
}
