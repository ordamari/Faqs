import { Controller, Get, Inject, Param } from '@nestjs/common'
import { UsersService } from 'src/users/services/users/users.service'

@Controller('users')
export class UsersController {
  @Inject(UsersService)
  private readonly usersService!: UsersService

  @Get()
  findById(@Param('id') id: string) {
    return this.usersService.findById(id)
  }
}
