import { Subject, User } from '@prisma/client'

export type UserWithSubjects = User & {
  subjects: Subject[]
}
