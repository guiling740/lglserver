import { Controller, Post, Body, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { InterviewService } from './services/interview.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumeQuizDto } from './dto/resume-quiz.dto';

@Controller('interview')
export class InterviewController {
    constructor(private readonly interviewService: InterviewService) { }
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
    /**
     * 简历押题的接口
     */
    @Post('resume/quiz/stream')
    @UseGuards(JwtAuthGuard)
    async resumeQuizStream(
        @Body() dto: ResumeQuizDto,
        @Request() req: any,
        @Res({ passthrough: false }) res: any,
    ) {
        const userId = req.user.userId;
        // 设置 SSE 响应头
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // 禁用 Nginx 缓冲
        // 订阅进度事件
        const subscription = this.interviewService
            .generateResumeQuizWithProgress(userId, dto)
            .subscribe({
                next: (event) => {
                    // 发送 SSE 事件
                    res.write(`data: ${JSON.stringify(event)}\n\n`);
                },
                error: (error) => {
                    // 发送错误事件
                    res.write(
                        `data: ${JSON.stringify({
                            type: 'error',
                            error: error.message,
                        })}\n\n`,
                    );
                    res.end();
                },
                complete: () => {
                    // 完成后关闭连接
                    res.end();
                },
            });

        // 客户端断开连接时取消订阅
        req.on('close', () => {
            subscription.unsubscribe();
        });
    }

}
