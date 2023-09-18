"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentStore = void 0;
const ravendb_1 = require("ravendb");
const fs = require("fs");
const getDocumentStore = (config) => {
    let documentStore;
    if (config.get("db.raven.secure")) {
        const authSettings = {
            certificate: fs.readFileSync(config.get("db.raven.certificate")),
            type: "pfx",
            password: config.get("db.raven.passphrase")
        };
        documentStore = new ravendb_1.default(config.get("db.raven.url"), config.get("db.raven.database"), authSettings);
    }
    else {
        documentStore = new ravendb_1.default(config.get("db.raven.url"), config.get("db.raven.database"));
    }
    return documentStore;
};
exports.getDocumentStore = getDocumentStore;
//# sourceMappingURL=getDocumentStore.js.map