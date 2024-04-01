import { BaseRepo } from "./Base.repo";
import { AlbumEntity } from "../entities/album.entity";

export class AlbumRepo extends BaseRepo<AlbumEntity> {

  private static pushNewTracks(findAlbumEntity: AlbumEntity, trackListInBody: Array<string>):void {
    for (let i = 0; trackListInBody.length > i; i++) {
        if (!findAlbumEntity.trackList.includes(trackListInBody[i])) {
          findAlbumEntity.trackList.push(trackListInBody[i]);
        }
    }
  }

  private static delTrack(findAlbumEntity: AlbumEntity, trackListInBody: Array<string>): void {
    for (let i = 0; trackListInBody.length > i; i++) {
      findAlbumEntity.trackList=findAlbumEntity.trackList.filter(item => item !== trackListInBody[i]);
    }
  }

  public async addTrackInAlbum(trackList: string[], albumId: string) {
    const session = this.documentStore.openSession();
    let result = await session.load(albumId, {
      documentType: this.descriptor.class
    });
    if (result) {
      AlbumRepo.pushNewTracks(result, trackList);
      result.lastUpdate = new Date().toLocaleString();
    }
    await session.saveChanges();
    await session.dispose();
    return this.metadataRemove(result);
  }

  public async delTrackInAlbum(body: AlbumEntity, albumId: string) {
    const session = this.documentStore.openSession();
    let result = await session.load(albumId, {
      documentType: this.descriptor.class
    });
    if (result) {
      AlbumRepo.delTrack(result, body.trackList);
      result.lastUpdate = new Date().toLocaleString();
    }
    await session.saveChanges();
    await session.dispose();
    return this.metadataRemove(result);
  }
  public async findAlbumsByIds(ids:string[]) {
    const session = this.documentStore.openSession();
    let result = await session.load(ids, { documentType: this.descriptor.class })
    const albumsArr:AlbumEntity[]=[]
    for(let key in result){
      albumsArr.push(this.metadataRemove(result[key]))
    }
    await session.saveChanges();
    await session.dispose();
    return albumsArr;
  }
}