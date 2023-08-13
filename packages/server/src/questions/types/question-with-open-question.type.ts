import { OpenQuestion, Question } from '@prisma/client'

export type QuestionWithOpenQuestion = {
  openQuestion: OpenQuestion
  type: 'OPEN'
} & Question
