import { BaseEntity } from './base.entity';
export declare class UsersEntity extends BaseEntity {
    get collectionName(): string;
    email: string;
    password: string;
    nikName: string;
    albumList: string[];
    status: string | null;
    photo: string | null;
    friends: string[];
    subscribe: string[];
}
