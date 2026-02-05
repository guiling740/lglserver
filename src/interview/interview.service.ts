import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class InterviewService {
  constructor(private readonly userService: UserService) {}

  createInterview(userId: number, interviewData: any) {
  }
}
