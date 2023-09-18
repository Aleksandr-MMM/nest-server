import { BaseEntity } from "../entities";
import DocumentStore, { IDocumentSession, ObjectTypeDescriptor } from "ravendb";
import { addProperty } from "../../helpers/addProperty";
import { AttachmentsTypeException, BadReqTypeException, IdNotFoundException } from "../../exception/ClientException";

export class BaseRepo<TEntity extends BaseEntity> {
  protected metadataRemove(obj: TEntity): TEntity | null {
    if (!obj) {
      return null;
    }
    const conv = obj;
    delete conv["__PROJECTED_NESTED_OBJECT_TYPES__"];
    delete conv["@metadata"];
    return conv;
  }

  constructor(
    protected readonly documentStore: DocumentStore,
    protected readonly descriptor: {
      class: ObjectTypeDescriptor<TEntity>;
      collection: string;
    }
  ) {
  }
  /**
   * Принимает имя файла и возвращает его расширение
   */
  protected combineFormatAndFilename(fileName: string): string {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(fileName)[1];
  }

  /**
   * Проверяет переданные поля у объектов на undefined и устанавливает их на null
   * @param body TEntity который extends BaseEntity
   * @param entity
   */
  public checkPropForUndefinedAndSetNull(
    body: TEntity, ...entity: string[]): TEntity {
    for (let i = 0; i < entity.length; i++) {
      body[entity[i]] = !body[entity[i]] ? null : body[entity[i]];
    }
    return body;
  }

  /**
   * Свойтво lastUpdate обновляет время на текущее
   */
  public static updateEntityDate(entity: BaseEntity) {
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
      BaseRepo.updateEntityDate(result);
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
    BaseRepo.updateEntityDate(body);
    // создание новой сущности в бд. id создается в БД сам
    await session.store(body, undefined);
    await session.saveChanges();
    session.dispose();
    return this.metadataRemove(body);
  }

  /**
   * Get document by id in db
   */
  protected async getById(id: string): Promise<TEntity> {
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
  protected async retrieveDocuments(): Promise<TEntity[]> {
    const session = this.documentStore.openSession();
    const results = await session
      .query({
        collection: this.descriptor.collection
      })
      .all();
    session.dispose();
    return results.map(this.metadataRemove);
  }

  /**
   * Document exists in db
   */
  public async documentExists(id: string): Promise<{data:boolean}> {
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
  protected async deleteById(id: string): Promise<{id:string}> {
    const session = this.documentStore.openSession();
    await session.delete(id);
    await session.saveChanges();
    session.dispose();
    return { id: id };
  }

  /**
   * add attachments in documents
   */
  public async addAttachment(documentId: string, file: Express.Multer.File): Promise<{ isAttachment: boolean }> {
    const session = this.documentStore.openSession();
    const isFindTrack = await this.documentExists(documentId);
    //  Проверка на наличие созданного документа
    if (isFindTrack.data) {
      const fileName = `${documentId}.${this.combineFormatAndFilename(file.originalname)}`;
      const checkAttachments = await session.advanced.attachments.exists(documentId, fileName);

      console.log(test)
      //  Проверка наличие вложений у документа
      if (!checkAttachments) {
        await session.advanced.attachments.store(documentId, fileName, file.buffer ,'ff');
      } else {
        throw new AttachmentsTypeException();
      }
    } else {
      throw new BadReqTypeException("Incorrect request.Please send correct id");
    }
    await session.saveChanges();
    session.dispose();
    return { isAttachment: true };
  }

  /**
   * Get attachments in documents
   */
  public async getAttachment(attachmentId: string, format: string) {
    const session = this.documentStore.openSession();
    const attachmentName = `${attachmentId}.${format}`;
    console.log(attachmentName)
    return await session.advanced.attachments.get(attachmentId, attachmentName);
  }
}