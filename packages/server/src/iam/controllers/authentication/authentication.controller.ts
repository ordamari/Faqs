import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
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
  private readonly authenticationService!: AuthenticationService

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { tokensData, user } = await this.authenticationService.signIn(
      signInDto
    )
    this.authenticationService.setTokensCookie(
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
    const { user, tokensData } = await this.authenticationService.signUp(
      signUpDto
    )
    this.authenticationService.setTokensCookie(
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
    const oldRefreshToken = this.authenticationService.extractTokenFromRequest(
      req,
      COOKIES_REFRESH_TOKEN_KEY
    )
    const { tokensData, user } = await this.authenticationService.refreshTokens(
      oldRefreshToken
    )
    this.authenticationService.setTokensCookie(
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
