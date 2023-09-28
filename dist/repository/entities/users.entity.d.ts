import { BaseEntity } from './base.entity';
import { Role } from "../../guard/RoleGuard/role.enum";
export declare class UsersEntity extends BaseEntity {
    get collectionName(): string;
    email: string;
    nikName: string;
    albumList: string[];
    status: string | null;
    friends: string[];
    subscribe: string[];
    protected: {
        password: string;
        roles: Role[];
    };
}
