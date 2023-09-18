"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumEntity = void 0;
const base_entity_1 = require("./base.entity");
class AlbumEntity extends base_entity_1.BaseEntity {
    get collectionName() {
        return "album";
    }
    constructor() {
        super();
    }
}
exports.AlbumEntity = AlbumEntity;
//# sourceMappingURL=album.entity.js.map