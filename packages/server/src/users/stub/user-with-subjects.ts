import { UserWithSubjects } from '../types/user-with-subjects.type'
import { userWithPassword } from './user-with-password'

export const userWithSubjects: UserWithSubjects = {
  ...userWithPassword,
  subjects: []
}
