"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseUrl = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const transform_interceptor_1 = require("./interceptor/transform.interceptor");
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
exports.baseUrl = `http://localhost:${PORT}`;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    await app.listen(PORT, () => {
        console.log(`Server start on : ${exports.baseUrl}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map