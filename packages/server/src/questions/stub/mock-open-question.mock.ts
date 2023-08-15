import { randomUUID } from 'crypto'
import { QuestionWithOpenQuestion } from '../types/question-with-open-question.type'
import { baseQuestionMock } from './base-question.mock'
import { createOpenQuestionDto } from './create-open-question-dto.mock'
import { questionId } from './question-id.mock'

export const mockOpenQuestion: QuestionWithOpenQuestion = {
  ...baseQuestionMock,
  type: 'OPEN',
  openQuestion: {
    answer: createOpenQuestionDto.openQuestion.answer,
    id: randomUUID(),
    questionId
  }
}
