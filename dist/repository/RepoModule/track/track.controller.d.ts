/// <reference types="multer" />
/// <reference types="node" />
import { PersistenceService, TrackRepo } from "../../index";
import { TrackDto } from "../../validate-dto/Track.dto";
import { Response } from "express";
import pipeable from "readable-stream";
import { AlbumEntity } from "../../entities/album.entity";
import { AlbumRepo } from "../../repos/Album.repo";
declare const TrackController_base: import("../../../helpers/type/ClassType").ClassType<import("../../../BaseFactory.controller").IFactoryCRUDController<TrackDto, TrackDto>>;
export declare class TrackController extends TrackController_base {
    readonly persistence: PersistenceService;
    readonly currentRepository: TrackRepo;
    readonly albumRepository: AlbumRepo;
    constructor(persistence: PersistenceService);
    uploadFile(file: Express.Multer.File, body: TrackDto): Promise<{
        isAttachment: boolean;
        id: string;
    }>;
    uploadFileAndAddInMyAlbum(file: Express.Multer.File, body: TrackDto, albumId: string): Promise<AlbumEntity>;
    getTrackFile(trackId: string, res: NodeJS.WritableStream | Response): Promise<pipeable.Readable | {
        data: null;
    }>;
}
export {};
