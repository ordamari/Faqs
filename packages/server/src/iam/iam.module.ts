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
import { JwtModule, JwtService } from '@nestjs/jwt'
import { AuthenticationController } from './controllers/authentication/authentication.controller'
import { GoogleAuthenticationService } from './services/google-authentication/google-authentication.service'
import { GoogleAuthenticationController } from './controllers/google-authentication/google-authentication.controller'
import { PrismaService } from 'src/common/services/prisma/prisma.service'

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
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
    AuthenticationController,
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
    UsersService,
    RedisService,
    GoogleAuthenticationService,
    GoogleAuthenticationController,
    PrismaService,
    JwtService
  ]
})
export class IamModule {}
