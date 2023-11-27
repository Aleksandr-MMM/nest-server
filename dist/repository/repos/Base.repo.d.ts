/// <reference types="multer" />
/// <reference types="node" />
import { BaseEntity } from "../entities";
import DocumentStore, { IDocumentSession, ObjectTypeDescriptor } from "ravendb";
import pipeable from "readable-stream";
export declare class BaseRepo<TEntity extends BaseEntity> {
    protected readonly documentStore: DocumentStore;
    protected readonly descriptor: {
        class: ObjectTypeDescriptor<TEntity>;
        collection: string;
    };
    protected metadataRemove(obj: TEntity): TEntity | null;
    protected combineFormatAndFilename(fileName: string): string;
    constructor(documentStore: DocumentStore, descriptor: {
        class: ObjectTypeDescriptor<TEntity>;
        collection: string;
    });
    checkPropForUndefinedAndSetNull(body: TEntity, ...entity: string[]): TEntity | null;
    updateEntityDate(entity: TEntity): void;
    openSesAndLoadDocById(id: string): Promise<[TEntity, IDocumentSession]>;
    updateDocument(entity: TEntity, id: string): Promise<TEntity>;
    storeDocument(body: TEntity, addExtraProperty?: object): Promise<TEntity>;
    getById(id: string): Promise<TEntity>;
    retrieveDocuments(): Promise<TEntity[]>;
    documentExists(id: string): Promise<{
        data: boolean;
    }>;
    deleteById(id: string): Promise<{
        id: string;
    }>;
    addAttachment(documentId: string, file: Express.Multer.File): Promise<{
        isAttachment: boolean;
    }>;
    getAttachment(attachmentId: string, format: string, res: NodeJS.WritableStream): Promise<pipeable.Readable> | never;
}
