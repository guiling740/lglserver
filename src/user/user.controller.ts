import {
  Post,
  Body,
  Get,
  Request,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { ResponseUtil } from '../common/utils/response.util';
import { Public } from '../auth/public.decorator';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.userService.register(registerDto);
    return ResponseUtil.success(result, '注册成功');
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const result = await this.userService.login(loginDto);
    return ResponseUtil.success(result, '登录成功');
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Request() req: any) {
    const { userId } = req.user;
    const userInfo = await this.userService.getUserInfo(userId);
    return ResponseUtil.success(userInfo, '获取成功');
  }

  @Put('profile')
  async updateUserProfile(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { userId } = req.user;
    const user = await this.userService.updateUser(userId, updateUserDto);
    return ResponseUtil.success(user, '更新成功');
  }

  /**
   * 获取用户消费记录（包括简历押题、专项面试、综合面试）
   */
  @Get('consumption-records')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '获取用户消费记录',
    description:
      '获取用户所有的功能消费记录，包括简历押题、专项面试、综合面试等',
  })
  async getUserConsumptionRecords(
    @Request() req: any,
    @Query('skip') skip: number = 0,
    @Query('limit') limit: number = 20,
  ) {
    const { userId } = req.user;
    const result = await this.userService.getUserConsumptionRecords(userId, {
      skip,
      limit,
    });
    return ResponseUtil.success(result, '获取成功');
  }
}
