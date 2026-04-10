import { UserService } from 'src/user/user.service';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AIModelFactory } from 'src/ai/services/ai-model.factory';
import { RESUME_QUIZ_PROMPT } from '../prompts/resume-quiz.prompts';

@Injectable()
export class InterviewService {
  constructor(private readonly userService: UserService) {}

  createInterview(userId: number, interviewData: any) {
  }
}
