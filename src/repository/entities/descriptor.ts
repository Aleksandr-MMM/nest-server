import { TrackEntity } from './track.entity';
import { AlbumEntity } from "./album.entity";
import { UsersEntity } from "./users.entity";

/**
 *  Создание сущностей в дескрипоре
 */
export const entityDescriptor = [
  {
    class: TrackEntity,
    collection: new TrackEntity().collectionName,
    name: TrackEntity.name,
  },
  {
    class: AlbumEntity,
    collection: new AlbumEntity().collectionName,
    name: AlbumEntity.name,
  },
  {
    class: UsersEntity,
    collection: new UsersEntity().collectionName,
    name: UsersEntity.name,
  },
];
/**
 *  Создание масива коллекций
 */
export const allCollections= entityDescriptor.map(descriptor=>descriptor.collection)

