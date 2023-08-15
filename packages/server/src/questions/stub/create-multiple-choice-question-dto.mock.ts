import { CreateQuestionDto } from '../dtos/create-question.dto'
import { baseQuestionDto } from './base-question-dto.mock'

export const createMultipleChoiceQuestionDto: CreateQuestionDto = {
  ...baseQuestionDto,
  type: 'MULTIPLE_CHOICE',
  multipleChoiceQuestion: {
    options: [
      {
        content: 'test',
        isCorrect: true
      },
      {
        content: 'test2',
        isCorrect: false
      }
    ]
  }
}
