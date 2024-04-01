"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProperty = void 0;
const addProperty = (...anyValue) => {
    let value;
    for (let i = 0; anyValue.length > i; i++) {
        value = Object.assign({}, anyValue[i]);
    }
    return value;
};
exports.addProperty = addProperty;
//# sourceMappingURL=addProperty.js.map