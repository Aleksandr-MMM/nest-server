import DocumentStore, { IAuthOptions } from "ravendb";
import * as fs from 'fs';
import { ConfigService } from "@nestjs/config";
/**
 *Получение и инициализация стора
 */
export const getDocumentStore = (config: ConfigService) => {
  let documentStore: DocumentStore;
  if (config.get("db.raven.secure")) {
    const authSettings: IAuthOptions = {
      certificate: fs.readFileSync(config.get("db.raven.certificate")),
      type: "pfx",
      password: config.get("db.raven.passphrase")
    };

    documentStore = new DocumentStore(
      config.get<string>("db.raven.url"),
      config.get<string>("db.raven.database"),
      authSettings
    );

  } else {
    documentStore = new DocumentStore(
      config.get("db.raven.url"),
      config.get("db.raven.database")
    );
  }
  return documentStore
};