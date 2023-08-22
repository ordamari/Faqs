import { IsNotEmpty } from 'class-validator'

export class GoogleTokenInput {
  @IsNotEmpty()
  token: string
}
