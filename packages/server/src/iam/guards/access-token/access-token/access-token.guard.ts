import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import jwtConfig from 'src/iam/config/jwt.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  @Inject(JwtService)
  private readonly jwtService!: JwtService
  @Inject(jwtConfig.KEY)
  private readonly jwtConfiguration!: ConfigType<typeof jwtConfig>

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true
  }
}
