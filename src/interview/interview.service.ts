import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InterviewService {
  constructor(private readonly userService: UserService) {}

  createInterview(userId: number, interviewData: any) {
    // 验证用户是否存在
    const user = this.userService.findOne(userId);

    if (!user) {
      throw new Error('user do no exist');
    }
  }
}
