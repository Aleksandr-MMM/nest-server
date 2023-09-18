import { ConfigService } from "@nestjs/config";
import { RavendbService } from "./ravendb/ravendb.service";
import { AppDto } from "./repository/validate-dto/App.dto";
export declare class AppController {
    private readonly ravenService;
    private readonly config;
    constructor(ravenService: RavendbService, config: ConfigService);
    getEntities(): Promise<object>;
    createEntity(body: object): Promise<object>;
    updateCollection(body: AppDto): Promise<string>;
    getConfig(): object;
}
