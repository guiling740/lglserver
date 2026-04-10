import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './services/interview.service';
import { UserModule } from 'src/user/user.module';
import { AIModule } from 'src/ai/ai-model';

@Module({
  imports: [UserModule, AIModule],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
