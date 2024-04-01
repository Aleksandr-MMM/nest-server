"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumRepo = void 0;
const Base_repo_1 = require("./Base.repo");
class AlbumRepo extends Base_repo_1.BaseRepo {
    static pushNewTracks(findAlbumEntity, trackListInBody) {
        for (let i = 0; trackListInBody.length > i; i++) {
            if (!findAlbumEntity.trackList.includes(trackListInBody[i])) {
                findAlbumEntity.trackList.push(trackListInBody[i]);
            }
        }
    }
    static delTrack(findAlbumEntity, trackListInBody) {
        for (let i = 0; trackListInBody.length > i; i++) {
            findAlbumEntity.trackList = findAlbumEntity.trackList.filter(item => item !== trackListInBody[i]);
        }
    }
    async addTrackInAlbum(trackList, albumId) {
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
    async delTrackInAlbum(body, albumId) {
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
    async findAlbumsByIds(ids) {
        const session = this.documentStore.openSession();
        let result = await session.load(ids, { documentType: this.descriptor.class });
        const albumsArr = [];
        for (let key in result) {
            albumsArr.push(this.metadataRemove(result[key]));
        }
        await session.saveChanges();
        await session.dispose();
        return albumsArr;
    }
}
exports.AlbumRepo = AlbumRepo;
//# sourceMappingURL=Album.repo.js.map