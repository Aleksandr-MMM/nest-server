import { BaseEntity } from "./base.entity";
export declare class AlbumEntity extends BaseEntity {
    get collectionName(): string;
    albumName: string;
    trackList: Array<string>;
    lastUpdate: string;
}
