import { UserService } from 'src/user/user.service';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AIModelFactory } from 'src/ai/services/ai-model.factory';
import { RESUME_QUIZ_PROMPT } from '../prompts/resume-quiz.prompts';

@Injectable()
export class InterviewService {
  private readonly logger = new Logger(InterviewService.name);
  constructor(
    private configService: ConfigService,
    private aiModelFactory: AIModelFactory, // 注入AI模型工厂
  ) { }

  async analyzeResume(body: { resume: string, jobDescription: string }) {
    const { resume, jobDescription } = body;
    console.log('resume:', resume, jobDescription);
    // 创建prompt 模板
    const prompt = PromptTemplate.fromTemplate(RESUME_QUIZ_PROMPT);
    // 通过工厂函数获取模型，而不是自己初始化
    const model = this.aiModelFactory.createQueuePlusModel();
    // 创建输出解析器
    const parser = new JsonOutputParser();
    // 创建链：Prompt - Model - Parser
    const chain = prompt.pipe(model).pipe(parser);
    // 调用链
    try {
      // 执行链
      this.logger.log('开始分析简历...');
      const result = await chain.invoke({
        resumeText: resume,
        jobDescription,
      });
      this.logger.log('分析简历完成:', result);
      return result;
    } catch (error) {
      this.logger.error('Error analyzing resume:', error);
      throw error;
    }
  }
}
