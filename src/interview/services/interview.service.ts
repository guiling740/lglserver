import { UserService } from 'src/user/user.service';
import { PromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { AIModelFactory } from 'src/ai/services/ai-model.factory';
import { RESUME_QUIZ_PROMPT } from '../prompts/resume-quiz.prompts';
import { RESUME_ANALYSIS_SYSTEM_MESSAGE } from '../prompts/resume-analysis.prompts';
import { SessionManager } from '../../ai/services/session.manager';
import { ResumeAnalysisService } from './resume-analysis.service';
import { ConversationContinuationService } from './conversation-continuation.service';
import { ResumeQuizDto } from '../dto/resume-quiz.dto';
import { queueScheduler, Subject } from 'rxjs';

// 定义自定义的 ProgressEvent 类型
export interface ProgressEvent {
  type: 'progress';
  progress: number;
  message: string;
  status: 'generating' | 'error';
}

/**
 * Description placeholder
 *
 * @export
 * @class InterviewService
 * @typedef {InterviewService}
 */
@Injectable()
export class InterviewService {
  private readonly logger = new Logger(InterviewService.name);
  constructor(
    private configService: ConfigService,
    private aiModelFactory: AIModelFactory, // 注入AI模型工厂
    private sessionManager: SessionManager,
    private resumeAnalysisService: ResumeAnalysisService,
    private conversationContinuationService: ConversationContinuationService,
  ) {}
  async analyzeResume(
    userId: string,
    position: string,
    resumeContent: string,
    jobDescription: string,
  ) {
    try {
      // 第一步：创建新会话
      const systemMessage = RESUME_ANALYSIS_SYSTEM_MESSAGE(position);
      const sessionId = this.sessionManager.createSession(
        userId,
        position,
        systemMessage,
      );

      this.logger.log(`[${userId}]创建会话: ${sessionId}`);

      // 第二步：调用专门的简历分析服务
      const result = await this.resumeAnalysisService.analyze(
        resumeContent,
        jobDescription,
      );

      // 第三步：保存用户输入到会话历史
      this.sessionManager.addMessage(
        sessionId,
        'user',
        `简历内容：${resumeContent}`,
      );

      // 第四步：保存 AI 的回答到会话历史
      this.sessionManager.addMessage(
        sessionId,
        'assistant',
        JSON.stringify(result),
      );

      this.logger.log(`简历分析完成，sessionId: ${sessionId}`);

      return {
        sessionId,
        analysis: result,
      };
    } catch (error) {
      this.logger.error(`分析简历失败: ${error}`);
      throw error;
    }
  }

  /**
   * 继续对话（多轮，基于现有会话）
   *
   * @param sessionId 会话 ID
   * @param userQuestion 用户问题
   * @returns AI 的回答
   */
  async continueConversation(
    sessionId: string,
    userQuestion: string,
  ): Promise<string> {
    try {
      // 第一步：添加用户问题到会话历史
      this.sessionManager.addMessage(sessionId, 'user', userQuestion);

      // 第二步：获取对话历史
      const history = this.sessionManager.getRecentMessages(sessionId, 10);

      this.logger.log(
        `继续对话，sessionId: ${sessionId}，历史消息数: ${history.length}`,
      );

      // 第三步：调用专门的对话继续服务
      const aiResponse = await this.conversationContinuationService.continue(
        history,
      );

      // 第四步：保存 AI 的回答到会话历史
      this.sessionManager.addMessage(sessionId, 'assistant', aiResponse);

      this.logger.log(`对话继续完成，sessionId: ${sessionId}`);

      return aiResponse;
    } catch (error) {
      this.logger.error(`继续对话失败: ${error}`);
      throw error;
    }
  }

  /**
   * 生成简历押题（带流式进度）
   * @param userId 用户ID
   * @param dto 请求参数
   * @returns Subject 流式事件
   */
  generateResumeQuizWithProgress(
    userId: string,
    dto: ResumeQuizDto,
  ): Subject<ProgressEvent> {
    const subject = new Subject<ProgressEvent>();

    // 异步执行，通过 Subject 发送进度
    this.executeResumeQuiz(userId, dto, subject).catch((error) => {
      subject.error(error);
    });

    return subject;
  }
  /**
   * 执行简历押题（核心业务逻辑）
   */
  private async executeResumeQuiz(
    userId: string,
    dto: ResumeQuizDto,
    progressSubject?: Subject<ProgressEvent>,
  ): Promise<any> {
    try{
      // 定义不同阶段的提示信息
      const progressMessages = [
          // 0 - 0.2 理解阶段
          { progress: 0.05, message: 'AI 正在理解职位描述和简历内容...' },
          { progress: 0.1, message: 'AI 正在分析你的技术栈和项目经验...' },
          { progress: 0.15, message: 'AI 正在识别您的核心竞争力...' },
          { progress: 0.2, message: 'AI 正在对比岗位要求和您的背景...' },

          // 0.2 - 0.5 分析阶段
          { progress: 0.3, message: 'AI 正在进行岗位匹配分析...' },
          { progress: 0.4, message: 'AI 正在评估技能匹配度...' },
          { progress: 0.5, message: 'AI 正在分析项目经验相关性...' },

          // 0.5 - 0.8 推理阶段
          { progress: 0.6, message: 'AI 正在生成个性化优化建议...' },
          { progress: 0.7, message: 'AI 正在优化表达和关键词...' },
          { progress: 0.8, message: 'AI 正在完善简历结构...' },

          // 0.8 - 1 输出阶段
          { progress: 0.9, message: 'AI 正在生成最终结果...' },
          { progress: 1.0, message: '已完成分析 🎉' }
        ]

        // 模拟一个定时器：每间隔一秒，响应一次数据
        let progress = 0;
        let currentMessage = progressMessages[0];
        const interval = setInterval(() => {
          progress += 1
          currentMessage = progressMessages[progress];

          // 发送进度时间
          this.emitProgress(
            progressSubject,
            progress,
            currentMessage.message,
            'generating'
          )
          if(progress === progressMessages.length - 1){
            clearInterval(interval)
            return {
              questions: [], // 生成的问题列表
              analysis: [] // 生成的分析建议
            }
          }
        }, 1000);


    }catch(error){
      if(progressSubject && !progressSubject.closed){ 
        this.emitProgress(progressSubject, 100, '生成失败', 'error')
        progressSubject.error(error);
        progressSubject.complete();
      }

    }
  }
  private emitProgress(
    subject: Subject<ProgressEvent> | undefined,
    progress: number,
    message: string,
    status: 'generating' | 'error'
  ): void {
    if(subject && !subject.closed){
      subject.next({
        type: 'progress',
        progress,
        message,
        status
      } as ProgressEvent);
    }
  }
}
