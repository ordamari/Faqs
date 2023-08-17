import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './common/services/prisma/prisma.service'
import { QuestionsModule } from './questions/questions.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [QuestionsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
