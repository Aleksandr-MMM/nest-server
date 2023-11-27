import { UsersEntity } from "../entities/users.entity";
import { BaseRepo } from "./Base.repo";
import { Role } from "../../guard/RoleGuard/role.enum";
export declare class UsersRepo extends BaseRepo<UsersEntity> {
    private readonly ERROR_FRIEND_EXIST_TEXT;
    private readonly ERROR_EMAIL_USE_TEXT;
    private readonly ERROR_EMAIL_PASS_TEXT;
    private readonly PROPERTY_USER_FRIENDS;
    private readonly PROPERTY_USER_SUBSCRIBE;
    protected removeProtectedInfo(userProfile: UsersEntity): UsersEntity;
    protected deleteUserEmail(user: UsersEntity): UsersEntity;
    deleteUsersEmailAndProtectedInfo(users: UsersEntity[]): UsersEntity[];
    deleteEmailAndProtectedInfo(user: UsersEntity): UsersEntity;
    protected _findUserByEmail(email: string): Promise<UsersEntity | undefined>;
    createNewUser(email: string, password: string, roles: Role[]): Promise<UsersEntity | never>;
    addAlbumForUser(myId: string, albumId: string): Promise<UsersEntity>;
    findUserByEmailAndPass(email: string, pass: string, options?: {
        getRole: boolean;
    }): Promise<[email: string, id: string] | [email: string, id: string, Role[]]> | never;
    findUserByEmail(email: string): Promise<string | undefined>;
    subscribeUser(myId: string, userId: string): Promise<string[]>;
    unSubscribeUser(myId: string, userId: string): Promise<string[]>;
    addFriendList(myId: string, userId: string): Promise<string[]>;
    unFriend(myId: string, userId: string): Promise<string[]>;
    updateProfile(myId: string, newProperty: UsersEntity): Promise<UsersEntity>;
}
