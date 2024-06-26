import { BaseEntity } from "../entities";
import DocumentStore, { IDocumentSession, ObjectTypeDescriptor } from "ravendb";
import { addProperty } from "../../helpers/addProperty";
import { AttachmentsTypeException, IdNotFoundException } from "../../exception/ClientException";
import pipeable from "readable-stream";
import { BaseClientException } from "../../exception/BaseClientException";

type attachmentConfig={
    contentType:string
    formatFile:string
}

/**
 * Сущность репозитория включающая в себя базовые методы для доступа к БД
 */
export class BaseRepo<TEntity extends BaseEntity> {
  /**
   * Удаляет мета файлы и __PROJECTED_NESTED_OBJECT_TYPES__
   * @param obj созданная базовая сущность
   * @protected
   */
  protected metadataRemove(obj: TEntity): TEntity | null {
    if (!obj) {
      return null;
    }
    const conv = obj;
    delete conv["__PROJECTED_NESTED_OBJECT_TYPES__"];
    delete conv["@metadata"];
    return conv;
  }

  private async searchDocuments(session: IDocumentSession, id?: string, documentCount: number = 10, startCount: number = 0) {
    if (id) {
      return await session
        .query({
          collection: this.descriptor.collection
        })
        .take(documentCount)
        .skip(startCount)
        .whereNotEquals("id", id)
        .all();
    } else {
      return await session
        .query({
          collection: this.descriptor.collection
        })
        .take(documentCount)
        .skip(startCount)
        .all();
    }
  }

  /**
   * Принимает имя файла и возвращает его расширение
   */
  // protected combineFormatAndFilename(fileName: string): string {
  //   const re = /(?:\.([^.]+))?$/;
  //   return re.exec(fileName)[1];
  // }

  constructor(
    protected readonly documentStore: DocumentStore,
    protected readonly descriptor: {
      class: ObjectTypeDescriptor<TEntity>;
      collection: string;
    }) {
  }

  /**
   * Проверяет переданные поля у объектов на их наличие
   * и устанавливает их на null если не найденно
   * @param body TEntity  extends BaseEntity
   * @param entity
   */
  public checkPropForUndefinedAndSetNull(
    body: TEntity, ...entity: string[]): TEntity | null {
    for (let i = 0; i < entity.length; i++) {
      body[entity[i]] = !body[entity[i]] ? null : body[entity[i]];
    }
    return body;
  }

  /**
   * Свойтво lastUpdate обновляет время на текущее
   */
  public updateEntityDate(entity: TEntity) {
    entity.lastUpdate = new Date().toLocaleString();
  }

  /**
   * Открывает ссесию и возвращает документ из БД по id
   */
  public async openSesAndLoadDocById(id: string): Promise<[TEntity, IDocumentSession]> {
    const session = this.documentStore.openSession();
    let result = await session.load(id, {
      documentType: this.descriptor.class
    });
    return [result, session];
  }

  /**
   * Update document in db
   */
  public async updateDocument(entity: TEntity, id: string): Promise<TEntity> {
    const [result, session] = await this.openSesAndLoadDocById(id);
    if (result) {
      this.updateEntityDate(result);
      Object.assign(result, entity);
    }
    await session.saveChanges();
    await session.dispose();
    return this.metadataRemove(result);
  }

  /**
   * Add document in db
   */
  public async storeDocument(body: TEntity, addExtraProperty?: object): Promise<TEntity> {
    const session = this.documentStore.openSession();
    body["@metadata"] = {
      ["@collection"]: this.descriptor.collection,
      documentType: this.descriptor.class.name
    };
    body = addProperty(body, addExtraProperty);
    body.dateOfCreation = new Date().toLocaleString();
    this.updateEntityDate(body);
    // создание новой сущности в бд. id создается в БД сам
    await session.store(body, undefined);
    await session.saveChanges();
    session.dispose();
    return this.metadataRemove(body);
  }

  /**
   * Get document by id in db
   */
  public async getById(id: string): Promise<TEntity> {

    const [result, session] = await this.openSesAndLoadDocById(id);
    session.dispose();
    if (!result) {
      throw new IdNotFoundException;
    }
    if (result["@metadata"]["@collection"] !== this.descriptor.collection) {
      return null;
    }
    return this.metadataRemove(result);
  }


  /**
   * Get in db all document
   */
  public async retrieveDocuments(documentCount: number = 10, startCount: number = 0, exclude?: string)
    : Promise<TEntity[]> {
    const session = this.documentStore.openSession();
    const results = await this.searchDocuments(session, exclude);
    session.dispose();
    return results.map(this.metadataRemove);
  }

  /**
   * Document exists in db
   */
  public async documentExists(id: string): Promise<{ data: boolean }> {
    const session = this.documentStore.openSession();
    const exists = await session
      .query({
        collection: this.descriptor.collection,
        documentType: this.descriptor.class
      })
      .whereEquals("id", id)
      .any();
    session.dispose();
    return { data: exists };
  }

  /**
   * Get document by id in db
   */
  public async deleteById(id: string): Promise<{ id: string }> {
    const session = this.documentStore.openSession();
    await session.delete(id);
    await session.saveChanges();
    session.dispose();
    return { id: id };
  }

  /**
   * add attachments in documents
   */
  public async addAttachment(documentId: string, file: Express.Multer.File, config:attachmentConfig)
    : Promise<{ isAttachment: boolean, id: string }> {
    const session = this.documentStore.openSession();
    const isFindTrack = await this.documentExists(documentId);
    //  Проверка на наличие созданного документа
    if (isFindTrack.data) {
      const fileName = `${documentId}.${config.formatFile 
        // ? formatFile : this.combineFormatAndFilename(file.originalname)
      }`;
      await session.advanced.attachments.store(documentId, fileName, file.buffer,
        // "image/jpeg"
        config.formatFile
      );
    } else {
      throw new AttachmentsTypeException();
    }
    await session.saveChanges();
    session.dispose();
    return { isAttachment: true, id: documentId };
  }

  /**
   * Get attachments in documents
   */
  public async getAttachment(attachmentId: string, format: string, res: NodeJS.WritableStream | never)
    : Promise<pipeable.Readable | any> {
    const session = this.documentStore.openSession();

    const attachmentName = `${attachmentId}.${format}`;
    const attachmentResult = await session.advanced.attachments.get(attachmentId, attachmentName);
    if (attachmentResult) {
      const stream = attachmentResult.data;
      stream.pipe(res);
      return stream;
    } else {
      throw new BaseClientException(404, "Attachment not found");
    }
  }
}
