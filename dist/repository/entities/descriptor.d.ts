import { TrackEntity } from './track.entity';
import { AlbumEntity } from "./album.entity";
import { UsersEntity } from "./users.entity";
export declare const entityDescriptor: ({
    class: typeof TrackEntity;
    collection: string;
    name: string;
} | {
    class: typeof AlbumEntity;
    collection: string;
    name: string;
} | {
    class: typeof UsersEntity;
    collection: string;
    name: string;
})[];
export declare const allCollections: string[];
