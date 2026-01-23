import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule], // 引入数据库模块
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
