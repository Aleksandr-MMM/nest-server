/// <reference types="multer" />
import { BaseEntity } from "../entities";
import DocumentStore, { IDocumentSession, ObjectTypeDescriptor } from "ravendb";
export declare class BaseRepo<TEntity extends BaseEntity> {
    protected readonly documentStore: DocumentStore;
    protected readonly descriptor: {
        class: ObjectTypeDescriptor<TEntity>;
        collection: string;
    };
    protected metadataRemove(obj: TEntity): TEntity | null;
    constructor(documentStore: DocumentStore, descriptor: {
        class: ObjectTypeDescriptor<TEntity>;
        collection: string;
    });
    protected combineFormatAndFilename(fileName: string): string;
    checkPropForUndefinedAndSetNull(body: TEntity, ...entity: string[]): TEntity;
    static updateEntityDate(entity: BaseEntity): void;
    openSesAndLoadDocById(id: string): Promise<[TEntity, IDocumentSession]>;
    updateDocument(entity: TEntity, id: string): Promise<TEntity>;
    storeDocument(body: TEntity, addExtraProperty?: object): Promise<TEntity>;
    protected getById(id: string): Promise<TEntity>;
    protected retrieveDocuments(): Promise<TEntity[]>;
    documentExists(id: string): Promise<{
        data: boolean;
    }>;
    protected deleteById(id: string): Promise<{
        id: string;
    }>;
    addAttachment(documentId: string, file: Express.Multer.File): Promise<{
        isAttachment: boolean;
    }>;
    getAttachment(attachmentId: string, format: string): Promise<import("ravendb").AttachmentResult>;
}
