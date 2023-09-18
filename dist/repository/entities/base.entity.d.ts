export declare abstract class BaseEntity {
    id: string;
    lastUpdate: string;
    dateOfCreation: string;
    abstract get collectionName(): string;
}
