"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcludeInterceptor = void 0;
const operators_1 = require("rxjs/operators");
class ExcludeInterceptor {
    static isExcludePaths(requestUrl, next, operator) {
        if (ExcludeInterceptor.excludePaths.includes(requestUrl)) {
            return next.handle();
        }
        else {
            return next.handle().pipe((0, operators_1.map)(data => (Object.assign({ data }, operator))));
        }
    }
}
exports.ExcludeInterceptor = ExcludeInterceptor;
ExcludeInterceptor.excludePaths = ["/auth/confirmReg/:token", "/user/photo/:id"];
//# sourceMappingURL=ExcludeInterceptor.js.map