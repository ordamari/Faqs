import { User } from '@prisma/client'
import { userId } from './user-id'
import { googleId } from './google-id'

export const userWithGoogleId: User = {
  id: userId,
  email: 'test@test.com',
  encryptedPassword: null,
  firstName: 'Or',
  lastName: 'Damari',
  googleId: googleId
}
