import { ConfigService } from "@nestjs/config";
import { MyLogger } from "../../../Loger/Loger";
export declare class RavendbService {
    private readonly config;
    private tryConnectingStore;
    private readonly store;
    constructor(config: ConfigService, logger: MyLogger);
    storeDocument(document: object): Promise<object>;
    updateCollection(databaseName: string, entityName: string, entityValue: string): Promise<string>;
}
