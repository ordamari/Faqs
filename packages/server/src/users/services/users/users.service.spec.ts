import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { userWithPassword } from 'src/users/stub/user-with-password'

describe('UsersService', () => {
  let service: UsersService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService]
    }).compile()

    service = module.get<UsersService>(UsersService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('createUserWithPassword', async () => {
    jest.spyOn(prisma.user, 'create').mockResolvedValue(userWithPassword)
    const result = await service.createWithPassword(
      userWithPassword.email,
      userWithPassword.encryptedPassword
    )
    expect(result.email).toEqual(userWithPassword.email)
    expect(result.encryptedPassword).toEqual(userWithPassword.encryptedPassword)
  })

  it('createUserWithGoogleId', async () => {
    jest.spyOn(prisma.user, 'create').mockResolvedValue(userWithPassword)
    const result = await service.createWithGoogle(
      userWithPassword.email,
      userWithPassword.googleId
    )
    expect(result.email).toEqual(userWithPassword.email)
    expect(result.googleId).toEqual(userWithPassword.googleId)
  })

  it('findByEmail', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userWithPassword)
    const result = await service.findByEmail(userWithPassword.email)
    expect(result.email).toEqual(userWithPassword.email)
    expect(result.encryptedPassword).toEqual(userWithPassword.encryptedPassword)
  })

  it('findById', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userWithPassword)
    const result = await service.findById(userWithPassword.id)
    expect(result.email).toEqual(userWithPassword.email)
    expect(result.encryptedPassword).toEqual(userWithPassword.encryptedPassword)
  })

  it('findByGoogleId', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(userWithPassword)
    const result = await service.findByGoogleId(userWithPassword.googleId)
    expect(result.email).toEqual(userWithPassword.email)
    expect(result.googleId).toEqual(userWithPassword.googleId)
  })
})
