import { Controller, Post, Body } from '@nestjs/common';
import { InterviewService } from './services/interview.service';

@Controller('interview')
export class InterviewController {
    constructor(private readonly interviewService: InterviewService) {}
    @Post('/analyze-resume')
    async analyzeResume(@Body() body: { resume: string, jobDescription: string }) {
        const result = await this.interviewService.analyzeResume(body);
        
        return {
            code: 200,
            data: result,
        }
    }
}
