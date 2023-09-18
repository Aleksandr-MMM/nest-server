/// <reference types="multer" />
import { BaseRepo } from "./Base.repo";
import { TrackEntity } from "../entities";
export declare class TrackRepo extends BaseRepo<TrackEntity> {
    private ERRORMESSAGE;
    addFile(file: Express.Multer.File, paramsId: string): Promise<any>;
}
