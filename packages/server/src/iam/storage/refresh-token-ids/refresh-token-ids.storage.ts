import { Inject, Injectable } from '@nestjs/common'
import { RedisService } from 'src/redis/services/redis/redis.service'

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage {
  @Inject(RedisService)
  private readonly redisService!: RedisService
  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redisService.redisClient.set(this.getKey(userId), tokenId)
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedId = await this.redisService.redisClient.get(
      this.getKey(userId)
    )
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError()
    }
    return storedId === tokenId
  }

  async invalidate(userId: string): Promise<void> {
    await this.redisService.redisClient.del(this.getKey(userId))
  }

  private getKey(userId: string): string {
    return `user-${userId}`
  }
}
