import { randomUUID } from 'crypto'
import { QuestionWithMultiChoiceQuestion } from '../types/question-with-multi-choice-question.type'
import { baseQuestionMock } from './base-question.mock'
import { createMultipleChoiceQuestionDto } from './create-multiple-choice-question-dto.mock'
import { multiChoiceId } from './multi-choice-id.mock'
import { questionId } from './question-id.mock'

export const mockMultiChoiceQuestion: QuestionWithMultiChoiceQuestion = {
  ...baseQuestionMock,
  type: 'MULTIPLE_CHOICE',
  multiChoiceQuestion: {
    id: multiChoiceId,
    questionId,
    options: createMultipleChoiceQuestionDto.multipleChoiceQuestion.options.map(
      (option) => ({
        id: randomUUID(),
        content: option.content,
        isCorrect: option.isCorrect,
        multipleChoiceQuestionId: multiChoiceId
      })
    )
  }
}
