import { CreateQuestionDto } from '../dtos/create-question.dto'
import { baseQuestionDto } from './base-question-dto.mock'

export const createSortQuestionDto: CreateQuestionDto = {
  ...baseQuestionDto,
  type: 'SORT',
  sortQuestion: {
    items: [
      {
        content: 'test',
        sort: 1
      },
      {
        content: 'test2',
        sort: 2
      },
      {
        content: 'test3',
        sort: 3
      }
    ]
  }
}
