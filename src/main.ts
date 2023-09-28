import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from "./interceptor/transform.interceptor";
import { ConfigService } from "@nestjs/config";

const PORT=process.env.PORT ? parseInt(process.env.PORT) : 5000
export const baseUrl= `http://localhost:${PORT}`

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  // const port =configService.get('PORT');
  // console.log(port)
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(PORT,()=>{
    console.log(`Server start on : ${baseUrl}`)
  });
}
bootstrap();
