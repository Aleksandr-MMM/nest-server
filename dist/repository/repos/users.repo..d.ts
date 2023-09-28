import { UsersEntity } from "../entities/users.entity";
import { BaseRepo } from "./Base.repo";
import { Role } from "../../guard/RoleGuard/role.enum";
export declare class UsersRepo extends BaseRepo<UsersEntity> {
    private readonly ERROR_FRIEND_EXIST_TEXT;
    private readonly ERROR_EMAIL_USE_TEXT;
    private readonly ERROR_EMAIL_PASS_TEXT;
    private readonly PROPERTY_USER_FRIENDS;
    private readonly PROPERTY_USER_SUBSCRIBE;
    users: UsersEntity[];
    protected removeProtectedInfo(userProfile: UsersEntity): UsersEntity;
    protected _findUserByEmail(email: string): Promise<UsersEntity | undefined>;
    createNewUser(email: string, password: string, roles: Role[]): Promise<UsersEntity | undefined>;
    addAlbumForUser(myId: string, albumId: string): Promise<UsersEntity>;
    findUserByEmailAndPass(email: string, pass: string, options?: {
        getRole: boolean;
    }): Promise<(string | Role[])[] | undefined>;
    findUserByEmail(email: string): Promise<string | undefined>;
    subscribeUser(myId: string, userId: string): Promise<string[]>;
    unSubscribeUser(myId: string, userId: string): Promise<string[]>;
    addFriendList(myId: string, userId: string): Promise<string[]>;
    unFriend(myId: string, userId: string): Promise<string[]>;
}
