import { AlbumEntity } from "../../entities/album.entity";
import { AlbumRepo } from "../../repos/Album.repo";
import { PersistenceService } from "../../index";
import { AlbumPostDto, AlbumPutDto } from "../../validate-dto/Album.dto";
import { UsersRepo } from "../../repos/users.repo.";
import { UsersEntity } from "../../entities/users.entity";
declare const AlbumController_base: import("../../../helpers/type/ClassType").ClassType<import("../../../BaseFactory.controller").IFactoryCRUDController<AlbumPostDto, AlbumPutDto>>;
export declare class AlbumController extends AlbumController_base {
    readonly persistence: PersistenceService;
    readonly albumRepository: AlbumRepo;
    readonly userRepository: UsersRepo;
    readonly addNewAlbumProperty: {
        trackList: any[];
    };
    constructor(persistence: PersistenceService);
    createDocument(body: AlbumEntity, req: any): Promise<UsersEntity>;
    pushTrackInDocument(id: string, body: AlbumEntity): Promise<AlbumEntity>;
    delTrackInDocument(id: string, body: AlbumEntity): Promise<AlbumEntity>;
}
export {};
