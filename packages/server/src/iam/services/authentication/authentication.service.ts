import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { HashingService } from '../hashing/hashing.service'
import { UsersService } from 'src/users/services/users/users.service'
import { JwtService } from '@nestjs/jwt'
import jwtConfig from 'src/iam/config/jwt.config'
import { ConfigType } from '@nestjs/config'
import { RefreshTokenIdsStorage } from 'src/iam/storage/refresh-token-ids/refresh-token-ids.storage'
import { CookieOptions, Request, Response } from 'express'
import { SignUpDto } from 'src/iam/dto/sign-up.dto'
import { randomUUID } from 'crypto'
import { User } from '@prisma/client'
import { ActiveUserData } from 'src/iam/types/active-user-data.type'
import { TokensData } from 'src/iam/types/tokens-data.type'
import { SignInDto } from 'src/iam/dto/sign-in.dto'
import { COOKIES_ACCESS_TOKEN_KEY } from 'src/iam/constants/cookies-access-token-key.constant'
import { COOKIES_REFRESH_TOKEN_KEY } from 'src/iam/constants/cookies-refresh-token-key.constant'

@Injectable()
export class AuthenticationService {
  @Inject(HashingService)
  private readonly hashingService!: HashingService
  @Inject(UsersService)
  private readonly usersService!: UsersService
  @Inject(JwtService)
  private readonly jwtService!: JwtService
  @Inject(jwtConfig.KEY)
  private readonly jwtConfiguration!: ConfigType<typeof jwtConfig>
  @Inject(RefreshTokenIdsStorage)
  private readonly refreshTokenIdsStorage!: RefreshTokenIdsStorage

  private cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  } as CookieOptions

  async signUp(signUpInput: SignUpDto) {
    const encryptedPassword = await this.hashingService.hash(
      signUpInput.password
    )
    const user = await this.usersService.createWithPassword(
      signUpInput.email,
      encryptedPassword
    )
    const tokensData = await this.generateTokens(user)
    return { user, tokensData }
  }

  async signIn(signInInput: SignInDto) {
    const user = await this.usersService.findByEmail(signInInput.email)
    if (!user) {
      throw new UnauthorizedException('No user with such email')
    }
    const isPasswordCorrect = await this.hashingService.compare(
      signInInput.password,
      user.encryptedPassword
    )
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Incorrect password')
    const tokensData = await this.generateTokens(user)
    return { tokensData, user }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const { userId, refreshTokenId } =
        await this.getIdAndUserIdFromRefreshToken(refreshToken)
      const isValidRefreshToken = await this.refreshTokenIdsStorage.validate(
        userId,
        refreshTokenId
      )
      if (isValidRefreshToken) {
        await this.refreshTokenIdsStorage.invalidate(userId)
      } else throw new UnauthorizedException('Invalid refresh token')

      const user = await this.usersService.findById(userId)
      if (!user) throw new UnauthorizedException('No user with such id')
      const tokensData = await this.generateTokens(user)
      return { tokensData, user }
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID()

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }
      ),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId
      })
    ])
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId)
    return {
      accessToken,
      refreshToken,
      accessTokenExpires: new Date(
        Date.now() + this.jwtConfiguration.accessTokenTtl * 1000
      ),
      refreshTokenExpires: new Date(
        Date.now() + this.jwtConfiguration.refreshTokenTtl * 1000
      )
    } as TokensData
  }

  setTokensCookie(
    response: Response,
    accessToken: string,
    refreshToken: string
  ) {
    response.cookie(COOKIES_ACCESS_TOKEN_KEY, accessToken, this.cookieOptions)
    response.cookie(COOKIES_REFRESH_TOKEN_KEY, refreshToken, this.cookieOptions)
  }

  extractTokenFromRequest(request: Request, key = COOKIES_ACCESS_TOKEN_KEY) {
    const token = request.cookies[key]
    return token
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn
      }
    )
  }

  private async getIdAndUserIdFromRefreshToken(refreshToken: string) {
    const { sub: userId, refreshTokenId } = await this.jwtService.verifyAsync<
      Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
    >(refreshToken, {
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
      secret: this.jwtConfiguration.secret
    })
    return { userId, refreshTokenId }
  }
}
