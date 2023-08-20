import { Module } from '@nestjs/common'
import { UsersService } from './services/users/users.service'
import { UsersController } from './controllers/users/users.controller'
import { PrismaService } from 'src/common/services/prisma/prisma.service'

@Module({
  providers: [UsersService, PrismaService],
  controllers: [UsersController]
})
export class UsersModule {}
