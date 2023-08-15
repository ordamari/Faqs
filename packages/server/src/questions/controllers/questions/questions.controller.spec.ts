import { Test, TestingModule } from '@nestjs/testing'
import { QuestionsController } from './questions.controller'
import { QuestionsService } from 'src/questions/services/questions/questions.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { mockOpenQuestion } from 'src/questions/stub/mock-open-question.mock'
import { mockMultiChoiceQuestion } from 'src/questions/stub/mock-multiple-choice-question.mock'
import { Question } from '@prisma/client'

describe('QuestionsController', () => {
  let controller: QuestionsController
  let service: QuestionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [QuestionsService, PrismaService]
    }).compile()
    controller = module.get<QuestionsController>(QuestionsController)
    service = module.get<QuestionsService>(QuestionsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return an array of questions', async () => {
    jest
      .spyOn(service, 'getQuestions')
      .mockImplementation(async () => [
        mockOpenQuestion,
        mockMultiChoiceQuestion
      ])
    const questions = await controller.findAll()
    expect(questions).toBeDefined()
    expect(questions.length).toBe(2)
  })
})
