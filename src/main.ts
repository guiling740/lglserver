import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
// 启动应用的函数
async function bootstrap() {
  // 创建Nest应用实例，传入AppModule模块
  const app = await NestFactory.create(AppModule);
  // 监听指定端口，默认3000端口
  await app.listen(process.env.PORT ?? 3000);
}

// 调用启动函数
bootstrap();
