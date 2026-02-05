import {
  Injectable,
  Inject,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserSchema, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. 找用户
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('邮箱或者密码不正确');
    }

    // 2. 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或者密码不正确');
    }

    // 3. 生成Token
    const token = this.jwtService.sign({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    // 4. 返回Token 和用户信息
    const userInfo = user.toObject();
    delete userInfo.password;

    return {
      token,
      user: userInfo,
    };
  }
}
