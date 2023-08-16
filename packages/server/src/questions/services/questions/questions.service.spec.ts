import { Test, TestingModule } from '@nestjs/testing'
import { QuestionsService } from './questions.service'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { CreateQuestionDto } from 'src/questions/dtos/create-question.dto'
import { mockOpenQuestion } from 'src/questions/stub/mock-open-question.mock'
import { questionId } from 'src/questions/stub/question-id.mock'
import { createOpenQuestionDto } from 'src/questions/stub/create-open-question-dto.mock'
import { mockMultiChoiceQuestion } from 'src/questions/stub/mock-multiple-choice-question.mock'
import { createMultipleChoiceQuestionDto } from 'src/questions/stub/create-multiple-choice-question-dto.mock'
import { mockSortQuestion } from 'src/questions/stub/mock-sort-question.mock'
import { createSortQuestionDto } from 'src/questions/stub/create-sort-question-dto'

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

  it('returns all questions', async () => {
    jest
      .spyOn(prisma.question, 'findMany')
      .mockResolvedValue([mockOpenQuestion])
    expect(await service.getQuestions()).toEqual([mockOpenQuestion])
  })

  it('returns a question by id', async () => {
    jest
      .spyOn(prisma.question, 'findUnique')
      .mockResolvedValue(mockOpenQuestion)
    expect(await service.getQuestion(questionId)).toEqual(mockOpenQuestion)
  })

  it('deletes a question by id', async () => {
    jest
      .spyOn(prisma.question, 'findUnique')
      .mockResolvedValue(mockOpenQuestion)
    jest.spyOn(prisma.question, 'delete').mockResolvedValue(mockOpenQuestion)
    expect(await service.removeQuestion(questionId)).toEqual(mockOpenQuestion)
  })

  it('create a open question', async () => {
    jest.spyOn(prisma.question, 'create').mockResolvedValue(mockOpenQuestion)
    expect(await service.createQuestion(createOpenQuestionDto)).toEqual(
      mockOpenQuestion
    )
  })

  it('create a multiple choice question', async () => {
    jest
      .spyOn(prisma.question, 'create')
      .mockResolvedValue(mockMultiChoiceQuestion)
    expect(
      await service.createQuestion(createMultipleChoiceQuestionDto)
    ).toEqual(mockMultiChoiceQuestion)
  })

  it('create a sort question', async () => {
    jest.spyOn(prisma.question, 'create').mockResolvedValue(mockSortQuestion)
    expect(await service.createQuestion(createSortQuestionDto)).toEqual(
      mockSortQuestion
    )
  })

  it('Error when creating a question with an invalid type', async () => {
    const wrongOpenQuestionDto: CreateQuestionDto = {
      ...createOpenQuestionDto,
      type: 'MULTIPLE_CHOICE'
    }
    const wrongMultiChoiceQuestionDto: CreateQuestionDto = {
      ...createMultipleChoiceQuestionDto,
      type: 'OPEN'
    }
    const wrongSortQuestionDto: CreateQuestionDto = {
      ...createSortQuestionDto,
      type: 'OPEN'
    }
    await expect(
      service.createQuestion(wrongOpenQuestionDto)
    ).rejects.toThrowError()

    await expect(
      service.createQuestion(wrongMultiChoiceQuestionDto)
    ).rejects.toThrowError()

    await expect(
      service.createQuestion(wrongSortQuestionDto)
    ).rejects.toThrowError()
  })

  it('update a open question', async () => {
    jest.spyOn(prisma.question, 'update').mockResolvedValue(mockOpenQuestion)
    expect(
      await service.updateQuestion({
        id: questionId,
        ...createOpenQuestionDto
      })
    ).toEqual(mockOpenQuestion)
  })

  it('update a multiple choice question', async () => {
    jest
      .spyOn(prisma.question, 'update')
      .mockResolvedValue(mockMultiChoiceQuestion)
    jest.spyOn(prisma.question, 'deleteMany').mockResolvedValue({ count: 0 })
    jest.spyOn(prisma.option, 'createMany').mockResolvedValue({ count: 0 })
    expect(
      await service.updateQuestion({
        id: questionId,
        ...createMultipleChoiceQuestionDto
      })
    ).toEqual(mockMultiChoiceQuestion)
  })

  it('update a sort question', async () => {
    jest.spyOn(prisma.question, 'update').mockResolvedValue(mockSortQuestion)
    jest.spyOn(prisma.sortItem, 'deleteMany').mockResolvedValue({ count: 0 })
    jest.spyOn(prisma.sortItem, 'createMany').mockResolvedValue({ count: 0 })
    expect(
      await service.updateQuestion({
        id: questionId,
        ...createSortQuestionDto
      })
    ).toEqual(mockSortQuestion)
  })

  it('Error when updating a question with an invalid type', async () => {
    const wrongOpenQuestionDto: CreateQuestionDto = {
      ...createOpenQuestionDto,
      type: 'MULTIPLE_CHOICE'
    }
    const wrongMultiChoiceQuestionDto: CreateQuestionDto = {
      ...createMultipleChoiceQuestionDto,
      type: 'OPEN'
    }
    const wrongSortQuestionDto: CreateQuestionDto = {
      ...createSortQuestionDto,
      type: 'OPEN'
    }
    await expect(
      service.updateQuestion({
        id: questionId,
        ...wrongOpenQuestionDto
      })
    ).rejects.toThrowError()

    await expect(
      service.updateQuestion({
        id: questionId,
        ...wrongMultiChoiceQuestionDto
      })
    ).rejects.toThrowError()

    await expect(
      service.updateQuestion({
        id: questionId,
        ...wrongSortQuestionDto
      })
    ).rejects.toThrowError()
  })
})
