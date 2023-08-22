import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import Redis from 'ioredis'
import redisConfig from 'src/redis/config/redis.config'

@Injectable()
export class RedisService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  @Inject(redisConfig.KEY)
  private readonly redisConfiguration!: ConfigType<typeof redisConfig>
  redisClient: Redis

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: this.redisConfiguration.host,
      port: this.redisConfiguration.port
    })
  }

  onApplicationShutdown() {
    return this.redisClient.quit()
  }
}
