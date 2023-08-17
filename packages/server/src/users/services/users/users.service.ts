import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma/prisma.service'

@Injectable()
export class UsersService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService

  async createWithPassword(email: string, encryptedPassword: string) {
    return this.prisma.user.create({
      data: {
        email,
        encryptedPassword
      }
    })
  }

  async createWithGoogle(email: string, googleId: string) {
    return this.prisma.user.create({
      data: {
        email,
        googleId
      }
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      },
      include: {
        subjects: {
          include: {
            questions: true
          }
        }
      }
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        subjects: {
          include: {
            questions: true
          }
        }
      }
    })
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: {
        googleId
      },
      include: {
        subjects: {
          include: {
            questions: true
          }
        }
      }
    })
  }
}
