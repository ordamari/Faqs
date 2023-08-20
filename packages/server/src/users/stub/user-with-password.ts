import { User } from '@prisma/client'
import { userId } from './user-id'

export const userWithPassword: User = {
  id: userId,
  email: 'test@test.com',
  encryptedPassword: 'encryptedPassword',
  firstName: 'Or',
  lastName: 'Damari',
  googleId: null
}
