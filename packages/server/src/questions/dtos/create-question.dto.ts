import { OpenQuestion, QuestionType } from '@prisma/client'
import { MultipleChoiceQuestionWithOptions } from '../types/multiple-choice-question-with-options.type'
import { SortQuestionWithItems } from '../types/sort-question-with-items.type'

export class CreateQuestionDto {
  readonly content: string
  readonly difficulty: number
  readonly hint?: string
  readonly type: QuestionType
  readonly openQuestion?: {
    readonly answer: OpenQuestion['answer']
  }
  readonly multipleChoiceQuestion?: MultipleChoiceQuestionWithOptions
  readonly sortQuestion?: SortQuestionWithItems
}
