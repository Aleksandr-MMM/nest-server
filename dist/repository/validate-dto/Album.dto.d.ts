import { AlbumEntity } from "../entities/album.entity";
export declare class AlbumPostDto extends AlbumEntity {
    albumName: string;
}
export declare class AlbumPutDto {
    trackList: Array<string>;
}
