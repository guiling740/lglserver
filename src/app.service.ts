import { Injectable } from '@nestjs/common';

// @Injectable decorator 表示是依赖注入的前提，表示这个类可以被注入到其他类中
@Injectable()
export class AppService {
  // 服务类通常包含service logic, database operations, etc. api 调用
  getHello(): string {
    return 'Hello World! lglserver';
  }
}
