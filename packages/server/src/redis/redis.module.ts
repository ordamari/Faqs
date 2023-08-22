import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import redisConfig from './config/redis.config'
import { RedisService } from './services/redis/redis.service'

@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [RedisService]
})
export class RedisModule {}
