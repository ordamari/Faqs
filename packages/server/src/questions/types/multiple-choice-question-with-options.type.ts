import { MultipleChoiceQuestion, Option } from '@prisma/client'

export type MultipleChoiceQuestionWithOptions = {
  options: Option[]
} & MultipleChoiceQuestion
