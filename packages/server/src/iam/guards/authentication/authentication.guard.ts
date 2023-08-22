import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_TYPE_KEY } from 'src/iam/decorators/auth.decorator'
import { AuthType } from 'src/iam/enums/auth-type.enum'
import { AccessTokenGuard } from '../access-token/access-token/access-token.guard'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) {}

  private static readonly defaultAuthTypes = AuthType.Bearer
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.Bearer]: this.accessTokenGuard,
    [AuthType.None]: { canActivate: () => true }
  }

  /**
   *  This Guard is used to verify the access token or no authentication is required
   * @param context Execution context
   * @returns True if the access token is valid or no authentication is required
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()]
    ) ?? [AuthenticationGuard.defaultAuthTypes]

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat()

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context)
      ).catch((e) => {
        throw new UnauthorizedException(e.message)
      })

      if (canActivate) return true
    }
    throw new UnauthorizedException('Invalid access token')
  }
}
