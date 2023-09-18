import { BaseEntity } from './base.entity';
export declare class TrackEntity extends BaseEntity {
    get collectionName(): string;
    trackName: string | null;
    author: string | null;
}
