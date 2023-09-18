import { ConfigService } from '@nestjs/config';
import { BaseEntity } from "../entities";
import { ClassType } from "../../helpers/type/ClassType";
import { BaseRepo } from "../repos/Base.repo";
export declare class PersistenceService {
    private readonly config;
    private readonly documentStore;
    private readonly descriptorsByCollection;
    readonly collectionsName: any[];
    private readonly descriptorsByName;
    private readonly documentInterfaces;
    private readonly logger;
    private executeIndexes;
    constructor(config: ConfigService);
    getCurrentRepository<TEntity extends BaseEntity, TRepo extends BaseRepo<TEntity>>(Entity: Function, newRepository: ClassType<TRepo>): TRepo;
}
