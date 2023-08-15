import { Question } from '@prisma/client'
import { MultipleChoiceQuestionWithOptions } from './multiple-choice-question-with-options.type'

export type QuestionWithMultiChoiceQuestion = {
  type: 'MULTIPLE_CHOICE'
  multiChoiceQuestion: MultipleChoiceQuestionWithOptions
} & Question
