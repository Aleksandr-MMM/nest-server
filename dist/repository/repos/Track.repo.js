"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackRepo = void 0;
const Base_repo_1 = require("./Base.repo");
const ClientException_1 = require("../../exception/ClientException");
class TrackRepo extends Base_repo_1.BaseRepo {
    constructor() {
        super(...arguments);
        this.ERRORMESSAGE = 'Incorrect request.Please send correct id';
    }
    async addFile(file, paramsId) {
        const session = this.documentStore.openSession();
        const isFindTrack = await this.documentExists(paramsId);
        if (isFindTrack.data) {
            const checkAttachments = await session.advanced.attachments.exists(paramsId, paramsId);
            if (!checkAttachments) {
                await session.advanced.attachments.store(paramsId, paramsId, file.buffer);
            }
            else {
                throw new ClientException_1.AttachmentsTypeException();
            }
        }
        else {
            throw new ClientException_1.BadReqTypeException(this.ERRORMESSAGE);
        }
        await session.saveChanges();
        session.dispose();
        return 200;
    }
}
exports.TrackRepo = TrackRepo;
//# sourceMappingURL=Track.repo.js.map