import { BaseRepo } from "./Base.repo";
import { AlbumEntity } from "../entities/album.entity";
export declare class AlbumRepo extends BaseRepo<AlbumEntity> {
    private static pushNewTracks;
    private static delTrack;
    addTrackInAlbum(body: AlbumEntity, albumId: string): Promise<AlbumEntity>;
    delTrackInAlbum(body: AlbumEntity, albumId: string): Promise<AlbumEntity>;
}
