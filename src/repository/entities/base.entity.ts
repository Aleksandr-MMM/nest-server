export abstract class BaseEntity{
  public id: string;
  public protected:{}
  public lastUpdate: string;
  public dateOfCreation :string
  public abstract get collectionName(): string;
}
