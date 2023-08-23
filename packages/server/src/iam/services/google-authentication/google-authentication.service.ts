import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException
} from '@nestjs/common'
import { UsersService } from 'src/users/services/users/users.service'
import { AuthenticationService } from '../authentication/authentication.service'
import { ConfigType } from '@nestjs/config'
import googleConfig from 'src/iam/config/google.config'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client

  @Inject(UsersService)
  private readonly usersService!: UsersService

  @Inject(AuthenticationService)
  private readonly authService!: AuthenticationService

  @Inject(googleConfig.KEY)
  private readonly googleConfiguration!: ConfigType<typeof googleConfig>

  onModuleInit() {
    const clientId = this.googleConfiguration.clientId
    const clientSecret = this.googleConfiguration.clientSecret
    this.oauthClient = new OAuth2Client(clientId, clientSecret)
  }

  async authenticate(token: string) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: token
      })
      const {
        email,
        sub: googleId,
        given_name,
        family_name
      } = loginTicket.getPayload()

      const user = await this.usersService.findByGoogleId(googleId)
      if (user) {
        const tokensData = await this.authService.generateTokens(user)
        return {
          tokensData,
          user
        }
      } else {
        return this.generateGoogleUser(email, googleId, given_name, family_name)
      }
    } catch (err) {
      throw new UnauthorizedException(
        "Can't authenticate with this google account"
      )
    }
  }

  private async generateGoogleUser(
    email: string,
    googleId: string,
    firstName: string,
    lastName: string
  ) {
    const newUser = await this.usersService.createWithGoogle(
      email,
      googleId,
      firstName,
      lastName
    )
    const tokensData = await this.authService.generateTokens(newUser)
    return {
      tokensData,
      user: newUser
    }
  }
}
