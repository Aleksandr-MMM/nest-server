"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allCollections = exports.entityDescriptor = void 0;
const track_entity_1 = require("./track.entity");
const album_entity_1 = require("./album.entity");
const users_entity_1 = require("./users.entity");
exports.entityDescriptor = [
    {
        class: track_entity_1.TrackEntity,
        collection: new track_entity_1.TrackEntity().collectionName,
        name: track_entity_1.TrackEntity.name,
    },
    {
        class: album_entity_1.AlbumEntity,
        collection: new album_entity_1.AlbumEntity().collectionName,
        name: album_entity_1.AlbumEntity.name,
    },
    {
        class: users_entity_1.UsersEntity,
        collection: new users_entity_1.UsersEntity().collectionName,
        name: users_entity_1.UsersEntity.name,
    },
];
exports.allCollections = exports.entityDescriptor.map(descriptor => descriptor.collection);
//# sourceMappingURL=descriptor.js.map