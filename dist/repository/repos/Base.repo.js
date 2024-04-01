"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepo = void 0;
const addProperty_1 = require("../../helpers/addProperty");
const ClientException_1 = require("../../exception/ClientException");
const BaseClientException_1 = require("../../exception/BaseClientException");
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
    async searchDocuments(session, id, documentCount = 10, startCount = 0) {
        if (id) {
            return await session
                .query({
                collection: this.descriptor.collection
            })
                .take(documentCount)
                .skip(startCount)
                .whereNotEquals("id", id)
                .all();
        }
        else {
            return await session
                .query({
                collection: this.descriptor.collection
            })
                .take(documentCount)
                .skip(startCount)
                .all();
        }
    }
    constructor(documentStore, descriptor) {
        this.documentStore = documentStore;
        this.descriptor = descriptor;
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
    async retrieveDocuments(documentCount = 10, startCount = 0, exclude) {
        const session = this.documentStore.openSession();
        const results = await this.searchDocuments(session, exclude);
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
    async addAttachment(documentId, file, config) {
        const session = this.documentStore.openSession();
        const isFindTrack = await this.documentExists(documentId);
        if (isFindTrack.data) {
            const fileName = `${documentId}.${config.formatFile}`;
            await session.advanced.attachments.store(documentId, fileName, file.buffer, config.formatFile);
        }
        else {
            throw new ClientException_1.AttachmentsTypeException();
        }
        await session.saveChanges();
        session.dispose();
        return { isAttachment: true, id: documentId };
    }
    async getAttachment(attachmentId, format, res) {
        const session = this.documentStore.openSession();
        const attachmentName = `${attachmentId}.${format}`;
        const attachmentResult = await session.advanced.attachments.get(attachmentId, attachmentName);
        if (attachmentResult) {
            const stream = attachmentResult.data;
            stream.pipe(res);
            return stream;
        }
        else {
            throw new BaseClientException_1.BaseClientException(404, "Attachment not found");
        }
    }
}
exports.BaseRepo = BaseRepo;
//# sourceMappingURL=Base.repo.js.map