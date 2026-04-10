import { Module } from "@nestjs/common";
import { AIModelFactory } from "./services/ai-model.factory";
import { SessionManager } from "./services/session.manager";


@Module({
    providers: [AIModelFactory, SessionManager],
    exports: [AIModelFactory, SessionManager], // 导出，这样其他模块可以使用
})

export class AIModule {}