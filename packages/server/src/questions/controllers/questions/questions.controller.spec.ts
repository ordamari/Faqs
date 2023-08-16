import { Test, TestingModule } from '@nestjs/testing'
import { QuestionsController } from './questions.controller'
import { QuestionsService } from 'src/questions/services/questions/questions.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { mockOpenQuestion } from 'src/questions/stub/mock-open-question.mock'
import { mockMultiChoiceQuestion } from 'src/questions/stub/mock-multiple-choice-question.mock'
import { createOpenQuestionDto } from 'src/questions/stub/create-open-question-dto.mock'

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

  it('should return a question by id', async () => {
    jest
      .spyOn(service, 'getQuestion')
      .mockImplementation(async () => mockOpenQuestion)
    const question = await controller.findOne(mockOpenQuestion.id)
    expect(question).toBeDefined()
    expect(question.id).toBe(mockOpenQuestion.id)
  })

  it('should remove a question by id', async () => {
    jest
      .spyOn(service, 'removeQuestion')
      .mockImplementation(async () => mockOpenQuestion)
    const question = await controller.remove(mockOpenQuestion.id)
    expect(question).toBeDefined()
    expect(question.id).toBe(mockOpenQuestion.id)
  })

  it('should update a question by id', async () => {
    jest
      .spyOn(service, 'updateQuestion')
      .mockImplementation(async () => mockOpenQuestion)
    const question = await controller.update(mockOpenQuestion)
    expect(question).toBeDefined()
    expect(question.id).toBe(mockOpenQuestion.id)
    expect(question.content).toBe(mockOpenQuestion.content)
  })

  it('should create a open question', async () => {
    jest
      .spyOn(service, 'createQuestion')
      .mockImplementation(async () => mockOpenQuestion)
    const question = await controller.create(createOpenQuestionDto)
    expect(question).toBeDefined()
    expect(question.id).toBe(mockOpenQuestion.id)
    expect(question.content).toBe(mockOpenQuestion.content)
  })

  it('should create a multiple choice question', async () => {
    jest
      .spyOn(service, 'createQuestion')
      .mockImplementation(async () => mockMultiChoiceQuestion)
    const question = await controller.create(createOpenQuestionDto)
    expect(question).toBeDefined()
    expect(question.id).toBe(mockMultiChoiceQuestion.id)
    expect(question.content).toBe(mockMultiChoiceQuestion.content)
  })

  it('should create a multiple choice question', async () => {
    jest
      .spyOn(service, 'createQuestion')
      .mockImplementation(async () => mockMultiChoiceQuestion)
    const question = await controller.create(createOpenQuestionDto)
    expect(question).toBeDefined()
    expect(question.id).toBe(mockMultiChoiceQuestion.id)
    expect(question.content).toBe(mockMultiChoiceQuestion.content)
  })
})
