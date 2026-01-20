import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// 装饰器定义这是一个控制器，括号里可以传入路由前缀
// @Controller('users')表示所有路由都会加上/users前缀

@Controller()
export class AppController {
  // 构造函数注入AppService服务实例， private readonly表示这是一个私有只读属性
  constructor(private readonly appService: AppService) {}
  // 定义一个GET请求的处理方法，路由为根路径/，返回AppService服务实例的getHello方法的结果
  @Get()
  getHello(): string {
    // 调用AppService服务实例的getHello方法，返回结果
    return this.appService.getHello();
  }
}
