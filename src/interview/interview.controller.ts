import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { InterviewService } from './services/interview.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('interview')
export class InterviewController {
    constructor(private readonly interviewService: InterviewService) {}
    @Post('/analyze-resume')
    @UseGuards(JwtAuthGuard)
    async analyzeResume(
        @Body() body: { position: string; resume: string; jobDescription: string },
        @Request() req: any,
    ) {
        const result = await this.interviewService.analyzeResume(
            req.user.userId,
            body.position,
            body.resume,
            body.jobDescription,
        );
        
        return {
            code: 200,
            data: result,
        }
    }
    @Post('/continue-conversation')
    @UseGuards(JwtAuthGuard)
    async continueConversation(@Body() body: { sessionId: string, question: string }) {
        const result = await this.interviewService.continueConversation(
            body.sessionId,
            body.question,
        );
        return {
            code: 200,
            data: result,
        }
    }
}
