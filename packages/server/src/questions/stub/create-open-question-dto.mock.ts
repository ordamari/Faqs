import { CreateQuestionDto } from '../dtos/create-question.dto'
import { baseQuestionDto } from './base-question-dto.mock'

export const createOpenQuestionDto: CreateQuestionDto = {
  ...baseQuestionDto,
  type: 'OPEN',
  openQuestion: {
    answer: 'test'
  }
}
