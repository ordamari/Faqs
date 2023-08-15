import { OpenQuestion, QuestionType } from '@prisma/client'

export class CreateQuestionDto {
  readonly content: string
  readonly difficulty: number
  readonly hint?: string
  readonly type: QuestionType
  readonly openQuestion?: {
    readonly answer: OpenQuestion['answer']
  }
  readonly multipleChoiceQuestion?: {
    readonly options: {
      readonly content: string
      readonly isCorrect: boolean
    }[]
  }
  readonly sortQuestion?: {
    readonly items: {
      readonly content: string
      readonly sort: number
    }[]
  }
}
