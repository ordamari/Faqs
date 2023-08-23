import { Body, Controller, Inject, Post, Res } from '@nestjs/common'
import { Response } from 'express'
import { GoogleTokenDto } from 'src/iam/dto/google-token.dto'
import { AuthenticationService } from 'src/iam/services/authentication/authentication.service'
import { GoogleAuthenticationService } from 'src/iam/services/google-authentication/google-authentication.service'
import { ActiveUserData } from 'src/iam/types/active-user-data.type'

@Controller('google-authentication')
export class GoogleAuthenticationController {
  @Inject(AuthenticationService)
  private readonly authService!: AuthenticationService
  @Inject(GoogleAuthenticationService)
  private readonly googleAuthService!: GoogleAuthenticationService

  @Post()
  async googleAuth(
    @Res() res: Response,
    @Body() googleAuthDto: GoogleTokenDto
  ) {
    const { tokensData, user } = await this.googleAuthService.authenticate(
      googleAuthDto.token
    )
    this.authService.setTokensCookie(
      res,
      tokensData.accessToken,
      tokensData.refreshToken
    )

    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sub: user.id
    } as ActiveUserData
  }
}
