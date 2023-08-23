import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Request, Response } from 'express'
import jwtConfig from 'src/iam/config/jwt.config'
import { COOKIES_REFRESH_TOKEN_KEY } from 'src/iam/constants/cookies-refresh-token-key.constant'
import { Auth } from 'src/iam/decorators/auth.decorator'
import { SignInDto } from 'src/iam/dto/sign-in.dto'
import { SignUpDto } from 'src/iam/dto/sign-up.dto'
import { AuthType } from 'src/iam/enums/auth-type.enum'
import { AuthenticationService } from 'src/iam/services/authentication/authentication.service'
import { ActiveUserData } from 'src/iam/types/active-user-data.type'

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  private readonly authService!: AuthenticationService
  @Inject(jwtConfig.KEY)
  private readonly jwtConfiguration!: ConfigType<typeof jwtConfig>

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { tokensData, user } = await this.authService.signIn(signInDto)
    this.authService.setTokensCookie(
      res,
      tokensData.accessToken,
      tokensData.refreshToken
    )

    return {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    } as ActiveUserData
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const { user, tokensData } = await this.authService.signUp(signUpDto)
    this.authService.setTokensCookie(
      res,
      tokensData.accessToken,
      tokensData.refreshToken
    )
    return {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    } as ActiveUserData
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = this.authService.extractTokenFromRequest(
      req,
      COOKIES_REFRESH_TOKEN_KEY
    )
    const { tokensData, user } = await this.authService.refreshTokens(
      oldRefreshToken
    )
    this.authService.setTokensCookie(
      res,
      tokensData.accessToken,
      tokensData.refreshToken
    )
    return {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    } as ActiveUserData
  }
}
