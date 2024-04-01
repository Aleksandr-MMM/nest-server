import { Injectable } from "@nestjs/common";
import { DocumentStore, PatchByQueryOperation } from "ravendb";
import { ConfigService } from "@nestjs/config";

import { getDocumentStore } from "../../../helpers/getDocumentStore";
import { MyLogger } from "../../../Loger/Loger";

@Injectable()
export class RavendbService {

  private  tryConnectingStore(store: DocumentStore, tryConnectingCount: number,logger?:MyLogger): void {
    for (let i = 1; ; i++) {
      if(logger){
        logger.sendLogMessage(`Пытаюсь пожключиться к базе данных ${i} ...`,RavendbService.name)
      }
      try {
        const session = store.openSession();
        const objects = session.query({}).noTracking().first();
        if (objects) {
          if(logger){
            logger.sendLogMessage(`Произошло подключение к базе данных `,RavendbService.name)
          }
          break;
        }
      } catch (err) {
        if (i >= tryConnectingCount) {
          throw Error("Проюлемма с подключением к базе данных к базе данных.");
        }
      }
    }
  }

  private readonly store: DocumentStore;

   constructor(private readonly config: ConfigService,logger:MyLogger) {
    // create
    this.store = getDocumentStore(config);
    this.store.initialize();
    this.tryConnectingStore(this.store, 3, logger);
  }

  async storeDocument(document: object): Promise<object> {
    const session = this.store.openSession();
    await session.store(document);
    await session.saveChanges();
    session.dispose();
    return document;
  }

  async updateCollection(databaseName: string, entityName: string, entityValue: string): Promise<string> {
    await this.store.operations.send(new PatchByQueryOperation(
      `from '${databaseName}' ` + `update ` + `{this.${entityName}=${entityValue}}`));
    return "success";
  }

  // async listDocuments(): Promise<object> {
  //   const session = this.store.openSession();
  //   const objects = await session.query({}).noTracking().all();
  //   session.dispose();
  //   return objects;
  // }
}
