import DocumentStore from "ravendb";
import { ConfigService } from "@nestjs/config";
export declare const getDocumentStore: (config: ConfigService) => DocumentStore;
