/// <reference types="node" />
/// <reference types="multer" />
import { PersistenceService } from "../../index";
import { UsersRepo } from "../../repos/users.repo.";
import { UsersEntity } from "../../entities/users.entity";
import pipeable from "readable-stream";
import { UsersDto } from "../../validate-dto/Users.dto";
import { Response } from "express";
import { guardRequestType } from "../../../guard/base.guard";
export declare class UsersController {
    readonly persistence: PersistenceService;
    readonly currentRepository: UsersRepo;
    constructor(persistence: PersistenceService);
    getUsers(req: guardRequestType): Promise<{
        id: string;
        nickName: string;
    }[]>;
    getUserById(id: string): Promise<UsersEntity>;
    putUserProperty(body: UsersDto, req: guardRequestType): Promise<UsersEntity>;
    subscribeUser(req: any, userId: string): Promise<string[]>;
    unSubscribeUser(req: any, userId: string): Promise<string[]>;
    addFriend(req: any, userId: string): Promise<string[]>;
    unFriend(req: any, userId: string): Promise<string[]>;
    getPhoto(userId: string, res: NodeJS.WritableStream | Response): Promise<pipeable.Readable | {
        data: null;
    }>;
    addPhoto(file: Express.Multer.File, req: guardRequestType): Promise<{
        isAttachment: boolean;
    }>;
}
