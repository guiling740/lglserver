import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { InterviewModule } from './interview/interview.module';
import { DatabaseModule } from './database/database.module';

import { JwtModule } from '@nestjs/jwt';
import { getTokenExpirationSeconds } from './common/utils/jwt.util';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

// @Module装饰器用于定义一个模块 (NestJS的核心概念之一)
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局配置，这样在其他模块中可以直接使用ConfigService而不需要再次导入。
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/wwzhidao',
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const expirationSeconds = getTokenExpirationSeconds();
        return {
          secret: configService.get<string>('JWT_SECRET') || 'wwzhidao-secret',
          signOptions: {
            expiresIn: expirationSeconds,
          },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    UserModule,
    InterviewModule,
    DatabaseModule,
    PassportModule,
  ], // 这里可以导入其他模块，例如数据库模块、认证模块等。此处为空表示不依赖其他模块。
  controllers: [AppController], // 用来注册控制器，控制器负责HTTP请求的处理
  providers: [
    AppService, // 注册提供者，提供者通常是服务了，包含业务逻辑
    JwtStrategy, // JwtStrategy就被注册成全局可用了
  ],
})
export class AppModule {}
