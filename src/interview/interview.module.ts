import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './services/interview.service';
import { UserModule } from 'src/user/user.module';
import { AIModule } from 'src/ai/ai-model';
import { ResumeAnalysisService } from './services/resume-analysis.service';
import { ConversationContinuationService } from './services/conversation-continuation.service';

@Module({
  imports: [UserModule, AIModule],
  controllers: [InterviewController],
  providers: [InterviewService, ResumeAnalysisService, ConversationContinuationService],
})
export class InterviewModule {}
