import { Question } from '@prisma/client'
import { QuestionWithMultiChoiceQuestion } from './question-with-multi-choice-question.type'
import { QuestionWithOpenQuestion } from './question-with-open-question.type'
import { QuestionWithSortQuestion } from './question-with-sort-question.type'

export type AllQuestionTypes =
  | QuestionWithOpenQuestion
  | QuestionWithMultiChoiceQuestion
  | QuestionWithSortQuestion
  | Question
