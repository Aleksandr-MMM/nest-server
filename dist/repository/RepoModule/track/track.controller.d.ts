/// <reference types="multer" />
import { PersistenceService, TrackRepo } from "../../index";
import { TrackDto } from "../../validate-dto/Track.dto";
declare const TrackController_base: import("../../../helpers/type/ClassType").ClassType<import("../../../BaseFactory.controller").IFactoryCRUDController<TrackDto, TrackDto>>;
export declare class TrackController extends TrackController_base {
    readonly persistence: PersistenceService;
    readonly currentRepository: TrackRepo;
    constructor(persistence: PersistenceService);
    uploadFile(file: Express.Multer.File, trackId: string, body: TrackDto): Promise<{
        isAttachment: boolean;
    }>;
}
export {};
