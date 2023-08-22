import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './common/services/prisma/prisma.service'
import { QuestionsModule } from './questions/questions.module'
import { UsersModule } from './users/users.module'
import { IamModule } from './iam/iam.module'
import { RedisModule } from './redis/redis.module'

@Module({
  imports: [QuestionsModule, UsersModule, IamModule, RedisModule],
  controllers: [AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}
