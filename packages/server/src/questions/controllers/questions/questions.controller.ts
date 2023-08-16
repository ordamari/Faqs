import { Controller } from '@nestjs/common'
import { Inject, Get, Patch, Param, Body, Post, Delete } from '@nestjs/common'
import { UpdateQuestionDto } from 'src/questions/dtos/update-question.dto'
import { CreateQuestionDto } from 'src/questions/dtos/create-question.dto'
import { QuestionsService } from 'src/questions/services/questions/questions.service'
import { AllQuestionTypes } from 'src/questions/types/all-questionTypes.type'

@Controller('questions')
export class QuestionsController {
  @Inject(QuestionsService)
  private readonly questionService!: QuestionsService

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.createQuestion(createQuestionDto)
  }

  @Get()
  findAll(): Promise<AllQuestionTypes[]> {
    return this.questionService.getQuestions()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.getQuestion(id)
  }

  @Patch()
  update(@Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.updateQuestion(updateQuestionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.removeQuestion(id)
  }
}
