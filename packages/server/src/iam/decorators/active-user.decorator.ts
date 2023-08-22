import { createParamDecorator } from '@nestjs/common'
import { ActiveUserData } from '../types/active-user-data.type'
import { REQUEST_USER_KEY } from '../constants/request-user-key.constant'

export const ActiveUser = createParamDecorator(
  (specificField: keyof ActiveUserData | undefined, req: Request) => {
    const user: ActiveUserData = req[REQUEST_USER_KEY]
    return specificField ? user[specificField] : user
  }
)
