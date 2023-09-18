import { UsersEntity } from "../entities/users.entity";
export declare class UsersRegistrationDto extends UsersEntity {
    email: string;
}
export declare class UsersDto extends UsersRegistrationDto {
    password: string;
}
