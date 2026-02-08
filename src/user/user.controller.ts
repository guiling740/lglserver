import { Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { Public } from '../auth/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const result = await this.userService.login(loginDto);
    return ResponseUtil.success(result, '登录成功');
  }
}
