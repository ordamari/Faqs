import { randomUUID } from 'crypto'
import { QuestionWithSortQuestion } from '../types/question-with-sort-question.type'
import { baseQuestionMock } from './base-question.mock'
import { createSortQuestionDto } from './create-sort-question-dto'
import { questionId } from './question-id.mock'
import { sortId } from './sort-id.mock'

export const mockSortQuestion: QuestionWithSortQuestion = {
  ...baseQuestionMock,
  type: 'SORT',
  sortQuestion: {
    id: sortId,
    questionId,
    items: createSortQuestionDto.sortQuestion.items.map((item) => ({
      id: randomUUID(),
      content: item.content,
      sort: item.sort,
      sortQuestionId: sortId
    }))
  }
}
