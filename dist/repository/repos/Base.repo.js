"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepo = void 0;
const addProperty_1 = require("../../helpers/addProperty");
const ClientException_1 = require("../../exception/ClientException");
class BaseRepo {
    metadataRemove(obj) {
        if (!obj) {
            return null;
        }
        const conv = obj;
        delete conv["__PROJECTED_NESTED_OBJECT_TYPES__"];
        delete conv["@metadata"];
        return conv;
    }
    constructor(documentStore, descriptor) {
        this.documentStore = documentStore;
        this.descriptor = descriptor;
    }
    combineFormatAndFilename(fileName) {
        const re = /(?:\.([^.]+))?$/;
        return re.exec(fileName)[1];
    }
    checkPropForUndefinedAndSetNull(body, ...entity) {
        for (let i = 0; i < entity.length; i++) {
            body[entity[i]] = !body[entity[i]] ? null : body[entity[i]];
        }
        return body;
    }
    updateEntityDate(entity) {
        entity.lastUpdate = new Date().toLocaleString();
    }
    async openSesAndLoadDocById(id) {
        const session = this.documentStore.openSession();
        let result = await session.load(id, {
            documentType: this.descriptor.class
        });
        return [result, session];
    }
    async updateDocument(entity, id) {
        const [result, session] = await this.openSesAndLoadDocById(id);
        if (result) {
            this.updateEntityDate(result);
            Object.assign(result, entity);
        }
        await session.saveChanges();
        await session.dispose();
        return this.metadataRemove(result);
    }
    async storeDocument(body, addExtraProperty) {
        const session = this.documentStore.openSession();
        body["@metadata"] = {
            ["@collection"]: this.descriptor.collection,
            documentType: this.descriptor.class.name
        };
        body = (0, addProperty_1.addProperty)(body, addExtraProperty);
        body.dateOfCreation = new Date().toLocaleString();
        this.updateEntityDate(body);
        await session.store(body, undefined);
        await session.saveChanges();
        session.dispose();
        return this.metadataRemove(body);
    }
    async getById(id) {
        const [result, session] = await this.openSesAndLoadDocById(id);
        session.dispose();
        if (!result) {
            throw new ClientException_1.IdNotFoundException;
        }
        if (result["@metadata"]["@collection"] !== this.descriptor.collection) {
            return null;
        }
        return this.metadataRemove(result);
    }
    async retrieveDocuments() {
        const session = this.documentStore.openSession();
        const results = await session
            .query({
            collection: this.descriptor.collection
        })
            .all();
        session.dispose();
        return results.map(this.metadataRemove);
    }
    async documentExists(id) {
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
    async deleteById(id) {
        const session = this.documentStore.openSession();
        await session.delete(id);
        await session.saveChanges();
        session.dispose();
        return { id: id };
    }
    async addAttachment(documentId, file) {
        const session = this.documentStore.openSession();
        const isFindTrack = await this.documentExists(documentId);
        if (isFindTrack.data) {
            const fileName = `${documentId}.${this.combineFormatAndFilename(file.originalname)}`;
            const checkAttachments = await session.advanced.attachments.exists(documentId, fileName);
            if (!checkAttachments) {
                await session.advanced.attachments.store(documentId, fileName, file.buffer);
            }
            else {
                throw new ClientException_1.AttachmentsTypeException();
            }
        }
        else {
            throw new ClientException_1.BadReqTypeException("Incorrect request.Please send correct id");
        }
        await session.saveChanges();
        session.dispose();
        return { isAttachment: true };
    }
    async getAttachment(attachmentId, format) {
        const session = this.documentStore.openSession();
        const attachmentName = `${attachmentId}.${format}`;
        console.log(attachmentName);
        return await session.advanced.attachments.get(attachmentId, attachmentName);
    }
}
exports.BaseRepo = BaseRepo;
//# sourceMappingURL=Base.repo.js.map