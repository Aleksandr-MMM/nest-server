import { Injectable } from '@nestjs/common';
import { DocumentStore, PatchByQueryOperation } from "ravendb";
import { ConfigService } from "@nestjs/config";

import { getDocumentStore } from "../helpers/getDocumentStore";

@Injectable()
export class RavendbService {
  private readonly store:DocumentStore
  constructor(private readonly config: ConfigService) {

    this.store = getDocumentStore(config)
    this.store.initialize();
  }
  async storeDocument(document: object): Promise<object> {
    const session = this.store.openSession();
    await session.store(document);
    await session.saveChanges();
    session.dispose();
    return document;
  }
  async updateCollection(databaseName:string, entityName:string, entityValue:string):Promise<string> {
     await this.store.operations.send(new PatchByQueryOperation(
      `from '${databaseName}' ` + `update ` + `{this.${entityName}=${entityValue}}`))
    return 'success'
  }

  async listDocuments(): Promise<object> {
    const session = this.store.openSession();
    const objects = await session.query({}).noTracking().all();
    session.dispose();
    return objects;
  }
}
