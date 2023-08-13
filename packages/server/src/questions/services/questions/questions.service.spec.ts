import { Test, TestingModule } from '@nestjs/testing'
import { QuestionsService } from './questions.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { randomUUID } from 'crypto'
import { CreateQuestionDto } from 'src/questions/dtos/create-question.dto'
import { QuestionWithOpenQuestion } from 'src/questions/types/question-with-open-question.type'

describe('QuestionsService', () => {
  let service: QuestionsService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsService, PrismaService]
    }).compile()

    service = module.get<QuestionsService>(QuestionsService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  const createOpenQuestionDto: CreateQuestionDto = {
    content: 'test',
    difficulty: 1,
    type: 'OPEN',
    hint: 'test',
    openQuestion: {
      answer: 'test'
    }
  }

  const questionId = randomUUID()

  const mockOpenQuestion: QuestionWithOpenQuestion = {
    id: questionId,
    content: createOpenQuestionDto.content,
    difficulty: createOpenQuestionDto.difficulty,
    type: 'OPEN',
    hint: createOpenQuestionDto.hint,
    createdAt: new Date(),
    openQuestion: {
      answer: createOpenQuestionDto.openQuestion.answer,
      id: randomUUID(),
      questionId
    },
    subjectId: randomUUID(),
    updatedAt: new Date()
  }

  it('should do something', async () => {
    jest.spyOn(prisma.question, 'create').mockResolvedValue(mockOpenQuestion)
    expect(
      await service.createQuestion({
        content: mockOpenQuestion.content,
        difficulty: mockOpenQuestion.difficulty,
        type: mockOpenQuestion.type,
        hint: mockOpenQuestion.hint,
        openQuestion: mockOpenQuestion.openQuestion
      })
    ).toBeDefined()
  })
})
