import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import DocumentStore from 'ravendb';
import { BaseEntity, entityDescriptor } from "../entities";
import { ClassType } from "../../helpers/type/ClassType";
import { BaseRepo } from "../repos/Base.repo";
import { getDocumentStore } from "../../helpers/getDocumentStore";

@Injectable()
export class PersistenceService {
  private readonly documentStore: DocumentStore;
  private readonly descriptorsByCollection = {};
  readonly collectionsName =[]
  private readonly descriptorsByName = {};
  private readonly documentInterfaces = {};
  private readonly logger = new Logger(PersistenceService.name);

  private async executeIndexes() {
    // await this.documentStore.executeIndex(new UserSearchIndex());

  }
  constructor(private readonly config: ConfigService) {

    this.documentStore = getDocumentStore(config)

    entityDescriptor.forEach((descriptor) => {
      this.documentStore.conventions.registerEntityType(
        descriptor.class,
        descriptor.collection,
      );
      this.collectionsName.push(descriptor.collection)

      if (this.descriptorsByCollection[descriptor.collection]) {
        throw `Collection name ${descriptor.collection} already in use`;
      } else {
        this.descriptorsByCollection[descriptor.collection] = descriptor;
        this.descriptorsByName[descriptor.name] = descriptor;
      }
    });
    this.documentStore.initialize();

    this.executeIndexes().then(() =>
      this.logger.log('RavenDB index execution complete'),
    );
  }

  public getCurrentRepository<TEntity extends BaseEntity,
    TRepo extends BaseRepo<TEntity>>(Entity:Function, newRepository:ClassType<TRepo>):TRepo {
    if (!this.documentInterfaces[Entity.name]) {
      this.documentInterfaces[Entity.name] = new newRepository(
        this.documentStore,
        this.descriptorsByName[Entity.name],
      );
    }

    return this.documentInterfaces[Entity.name];
  }
}
