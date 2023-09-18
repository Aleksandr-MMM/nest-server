import { BaseEntity } from "./base.entity";

export class AlbumEntity extends BaseEntity {
  get collectionName(): string {
    return "album";
  }

  public albumName: string;
  public trackList: Array<string>;
  public lastUpdate: string
  public dataRegistration :string
  constructor() {
    super();

  }

}
