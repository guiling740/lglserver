import { Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @Public()
  async login(@Body loginDto: LoginDto) {
    const result = await this.userService.login(loginDto);
    return responseUtil.success(result, '登录成功');
  }
}
