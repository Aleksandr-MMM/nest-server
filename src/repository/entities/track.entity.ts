import { BaseEntity } from './base.entity';

export class TrackEntity extends BaseEntity {
  get  collectionName(): string {
    return 'track';
  }
  public trackName: string | null;
  public author: string | null;
}


