/// <reference types="node" />
/// <reference types="multer" />
import { PersistenceService } from "../../index";
import { UsersRepo } from "../../repos/users.repo.";
import { UsersEntity } from "../../entities/users.entity";
import pipeable from "readable-stream";
import { IGuardRequest } from "../../../guard/IGuard";
import { UsersDto } from "../../validate-dto/Users.dto";
export declare class UsersController {
    readonly persistence: PersistenceService;
    readonly currentRepository: UsersRepo;
    constructor(persistence: PersistenceService);
    getPhoto(userId: string, res: NodeJS.WritableStream): Promise<pipeable.Readable> | never;
    getUsers(): Promise<UsersEntity[]>;
    getUserById(id: string): Promise<UsersEntity>;
    subscribeUser(req: any, userId: string): Promise<string[]>;
    addFriend(req: any, userId: string): Promise<string[]>;
    putUserProperty(body: UsersDto, req: IGuardRequest): Promise<UsersEntity>;
    unSubscribeUser(req: any, userId: string): Promise<string[]>;
    unFriend(req: any, userId: string): Promise<string[]>;
    addPhoto(file: Express.Multer.File, req: IGuardRequest, userId: string): Promise<{
        isAttachment: boolean;
    }>;
}
