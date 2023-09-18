import { ConfigService } from "@nestjs/config";
export declare class RavendbService {
    private readonly config;
    private readonly store;
    constructor(config: ConfigService);
    storeDocument(document: object): Promise<object>;
    updateCollection(databaseName: string, entityName: string, entityValue: string): Promise<string>;
    listDocuments(): Promise<object>;
}
