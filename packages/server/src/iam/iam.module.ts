import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import jwtConfig from './config/jwt.config'
import googleConfig from './config/google.config'
import redisConfig from 'src/redis/config/redis.config'
import { HashingService } from './services/hashing/hashing.service'
import { BcryptService } from './services/bcrypt/bcrypt.service'
import { AccessTokenGuard } from './guards/access-token/access-token/access-token.guard'
import { RefreshTokenIdsStorage } from './storage/refresh-token-ids/refresh-token-ids.storage'
import { AuthenticationService } from './services/authentication/authentication.service'
import { UsersService } from 'src/users/services/users/users.service'
import { RedisService } from 'src/redis/services/redis/redis.service'
import { APP_GUARD } from '@nestjs/core'
import { AuthenticationGuard } from './guards/authentication/authentication.guard'

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(googleConfig),
    ConfigModule.forFeature(redisConfig)
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
    UsersService,
    RedisService
  ]
})
export class IamModule {}
