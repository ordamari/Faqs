import { Question } from '@prisma/client'
import { SortQuestionWithItems } from './sort-question-with-items.type'

export type QuestionWithSortQuestion = {
  sortQuestion: SortQuestionWithItems
  type: 'SORT'
} & Question
