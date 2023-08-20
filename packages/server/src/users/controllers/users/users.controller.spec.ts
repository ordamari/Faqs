import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from 'src/users/services/users/users.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { userWithPassword } from 'src/users/stub/user-with-password'
import { userWithSubjects } from 'src/users/stub/user-with-subjects'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService]
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  it('findById', async () => {
    jest
      .spyOn(service, 'findById')
      .mockImplementation(async () => userWithSubjects)
    const result = await controller.findById(userWithPassword.id)
    expect(result).toEqual(userWithSubjects)
  })
})
