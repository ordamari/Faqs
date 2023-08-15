import { randomUUID } from 'crypto'
import { baseQuestionDto } from './base-question-dto.mock'
import { questionId } from './question-id.mock'

export const baseQuestionMock = {
  id: questionId,
  content: baseQuestionDto.content,
  difficulty: baseQuestionDto.difficulty,
  hint: baseQuestionDto.hint,
  subjectId: randomUUID(),
  createdAt: new Date(),
  updatedAt: new Date()
}
