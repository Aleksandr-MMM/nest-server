import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from "./interceptor/transform.interceptor";

const PORT=process.env.PORT ? parseInt(process.env.PORT) : 3000

export const baseUrl= `http://localhost:${PORT}`

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(PORT,()=>{
    console.log(`Server start on port: ${PORT}`)
  });
}
bootstrap();
