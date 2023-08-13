import { CreateQuestionDto } from './create-question.dto'

export type UpdateQuestionDto = {
  id: string
} & CreateQuestionDto
