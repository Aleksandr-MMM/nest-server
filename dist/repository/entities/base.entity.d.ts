export declare abstract class BaseEntity {
    id: string;
    protected: {};
    lastUpdate: string;
    dateOfCreation: string;
    abstract get collectionName(): string;
}
