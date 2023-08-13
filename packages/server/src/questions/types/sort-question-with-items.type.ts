import { SortItem, SortQuestion } from '@prisma/client'

export type SortQuestionWithItems = {
  items: SortItem[]
} & SortQuestion
