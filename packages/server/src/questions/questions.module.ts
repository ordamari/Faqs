import { Module } from '@nestjs/common'
import { QuestionsService } from './services/questions/questions.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { QuestionsController } from './controllers/questions/questions.controller'

@Module({
  providers: [QuestionsService, PrismaService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
