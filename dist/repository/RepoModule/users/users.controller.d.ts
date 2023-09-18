/// <reference types="multer" />
import { PersistenceService } from "../../index";
import { UsersRepo } from "../../repos/users.repo.";
import { AttachmentResult } from "ravendb";
export declare class UsersController {
    readonly persistence: PersistenceService;
    readonly currentRepository: UsersRepo;
    constructor(persistence: PersistenceService);
    subscribeUser(req: any, userId: string): Promise<string[]>;
    unSubscribeUser(req: any, userId: string): Promise<string[]>;
    addFriend(req: any, userId: string): Promise<string[]>;
    unFriend(req: any, userId: string): Promise<string[]>;
    addPhoto(file: Express.Multer.File, req: any, userId: string): Promise<{
        isAttachment: boolean;
    }>;
    getPhoto(userId: string): Promise<AttachmentResult | null>;
}
