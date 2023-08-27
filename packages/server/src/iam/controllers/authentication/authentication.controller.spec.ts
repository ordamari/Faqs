import { Test, TestingModule } from '@nestjs/testing'
import { AuthenticationController } from './authentication.controller'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { tokensDataMock } from 'src/iam/stub/tokens-data.mock'
import { userWithSubjects } from 'src/users/stub/user-with-subjects'
import { Request, Response } from 'express'
import { HashingService } from 'src/iam/services/hashing/hashing.service'
import { BcryptService } from 'src/iam/services/bcrypt/bcrypt.service'
import { UsersService } from 'src/users/services/users/users.service'
import { QuestionsService } from 'src/questions/services/questions/questions.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import jwtConfig from 'src/iam/config/jwt.config'
import googleConfig from 'src/iam/config/google.config'
import redisConfig from 'src/redis/config/redis.config'
import { RefreshTokenIdsStorage } from 'src/iam/storage/refresh-token-ids/refresh-token-ids.storage'
import { RedisService } from 'src/redis/services/redis/redis.service'
import { AuthenticationService } from 'src/iam/services/authentication/authentication.service'

describe('AuthenticationController', () => {
  let controller: AuthenticationController
  let authenticationService: AuthenticationService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      imports: [
        ConfigModule.forFeature(jwtConfig),
        ConfigModule.forFeature(googleConfig),
        ConfigModule.forFeature(redisConfig)
      ],
      providers: [
        RefreshTokenIdsStorage,
        UsersService,
        QuestionsService,
        PrismaService,
        RedisService,
        JwtService,
        AuthenticationService,
        {
          provide: HashingService,
          useClass: BcryptService
        }
      ]
    }).compile()

    controller = module.get<AuthenticationController>(AuthenticationController)
    authenticationService = module.get<AuthenticationService>(
      AuthenticationService
    )
  })

  const mockRequest = {} as Request
  const mockResponse = {} as Response

  it('returns a logged in user', async () => {
    jest.spyOn(authenticationService, 'signIn').mockImplementation(async () => {
      return {
        tokensData: tokensDataMock,
        user: userWithSubjects
      }
    })
    const user = await controller.signIn(
      {
        email: userWithSubjects.email,
        password: 'password'
      },
      mockResponse
    )
    expect(user.email).toEqual(userWithSubjects.email)
  })

  it('returns a signed up user', async () => {
    jest.spyOn(authenticationService, 'signUp').mockImplementation(async () => {
      return {
        tokensData: tokensDataMock,
        user: userWithSubjects
      }
    })
    const user = await controller.signUp(
      {
        email: userWithSubjects.email,
        password: 'password'
      },
      mockResponse
    )
    expect(user.email).toEqual(userWithSubjects.email)
  })

  it('returns a refreshed user tokens', async () => {
    jest
      .spyOn(authenticationService, 'refreshTokens')
      .mockImplementation(async () => {
        return {
          tokensData: tokensDataMock,
          user: userWithSubjects
        }
      })
    const user = await controller.refresh(mockRequest, mockResponse)
    expect(user.email).toEqual(userWithSubjects.email)
  })
})
