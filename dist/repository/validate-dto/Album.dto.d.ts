import { AlbumEntity } from "../entities/album.entity";
export declare class AlbumPostDto extends AlbumEntity {
    albumName: string;
}
export declare class AlbumPutDto extends AlbumEntity {
    trackList: Array<string>;
}
