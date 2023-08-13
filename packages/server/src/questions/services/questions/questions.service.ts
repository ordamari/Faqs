import { HttpException, Inject, Injectable } from '@nestjs/common'
import { OpenQuestion } from '@prisma/client'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { CreateQuestionDto } from 'src/questions/dtos/create-question.dto'
import { UpdateQuestionDto } from 'src/questions/dtos/update-question.dto'
import { MultipleChoiceQuestionWithOptions } from 'src/questions/types/multiple-choice-question-with-options.type'
import { SortQuestionWithItems } from 'src/questions/types/sort-question-with-items.type'

@Injectable()
export class QuestionsService {
  @Inject(PrismaService)
  private readonly prisma!: PrismaService

  async getQuestions() {
    return this.prisma.question.findMany({
      include: {
        OpenQuestion: true,
        MultipleChoiceQuestion: {
          include: {
            options: true
          }
        },
        SortQuestion: {
          include: {
            items: true
          }
        }
      }
    })
  }

  async getQuestion(id: string) {
    return this.prisma.question.findUnique({
      where: {
        id
      },
      include: {
        OpenQuestion: true,
        MultipleChoiceQuestion: {
          include: {
            options: true
          }
        },
        SortQuestion: {
          include: {
            items: true
          }
        }
      }
    })
  }

  async deleteQuestion(id: string) {
    return this.prisma.question.delete({
      where: {
        id
      }
    })
  }

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const { content, difficulty, hint } = createQuestionDto
    switch (createQuestionDto.type) {
      case 'OPEN':
        if (!createQuestionDto.openQuestion)
          throw new HttpException(
            "type 'OPEN' must contain openQuestion data",
            400
          )
        return this._createOpenQuestion(
          createQuestionDto.openQuestion,
          content,
          difficulty,
          hint
        )
      case 'MULTIPLE_CHOICE':
        if (!createQuestionDto.multipleChoiceQuestion)
          throw new HttpException(
            "type 'MULTIPLE_CHOICE' must contain multipleChoiceQuestion data",
            400
          )
        return this._createMultipleChoiceQuestion(
          createQuestionDto.multipleChoiceQuestion,
          content,
          difficulty,
          hint
        )
      case 'SORT':
        if (!createQuestionDto.sortQuestion)
          throw new HttpException(
            "type 'SORT' must contain sortQuestion data",
            400
          )
        return this._createSortQuestion(
          createQuestionDto.sortQuestion,
          content,
          difficulty,
          hint
        )
    }
  }

  async updateQuestion(updateQuestionDto: UpdateQuestionDto) {
    if (!updateQuestionDto.id) throw new HttpException('id is required', 400)
    const { content, difficulty, hint, type, id } = updateQuestionDto
    switch (type) {
      case 'OPEN':
        if (!updateQuestionDto.openQuestion)
          throw new HttpException(
            "type 'OPEN' must contain openQuestion data",
            400
          )
        return this._updateOpenQuestion(
          updateQuestionDto.openQuestion,
          id,
          content,
          difficulty,
          hint
        )
      case 'MULTIPLE_CHOICE':
        if (!updateQuestionDto.multipleChoiceQuestion)
          throw new HttpException(
            "type 'MULTIPLE_CHOICE' must contain multipleChoiceQuestion data",
            400
          )
        return this._updateMultipleChoiceQuestion(
          updateQuestionDto.multipleChoiceQuestion,
          id,
          content,
          difficulty,
          hint
        )
      case 'SORT':
        if (!updateQuestionDto.sortQuestion)
          throw new HttpException(
            "type 'SORT' must contain sortQuestion data",
            400
          )
        return this._updateSortQuestion(
          updateQuestionDto.sortQuestion,
          id,
          content,
          difficulty,
          hint
        )
    }
  }

  private async _updateOpenQuestion(
    openQuestion: { answer: string },
    id: string,
    content: string,
    difficulty: number,
    hint?: string
  ) {
    const { answer } = openQuestion
    return this.prisma.question.update({
      where: {
        id
      },
      data: {
        content,
        difficulty,
        hint,
        OpenQuestion: {
          update: {
            answer
          }
        }
      }
    })
  }

  private async _updateMultipleChoiceQuestion(
    multipleChoiceQuestion: MultipleChoiceQuestionWithOptions,
    id: string,
    content: string,
    difficulty: number,
    hint?: string
  ) {
    await this._updateMultipleChoiceQuestionOptions(multipleChoiceQuestion)
    return this.prisma.question.update({
      where: {
        id
      },
      data: {
        content,
        difficulty,
        hint
      }
    })
  }

  private async _updateMultipleChoiceQuestionOptions(
    multipleChoiceQuestion: MultipleChoiceQuestionWithOptions
  ) {
    const { options } = multipleChoiceQuestion

    const questionOptions = await this.prisma.option.findMany({
      where: {
        MultipleChoiceQuestion: {
          id: multipleChoiceQuestion.id
        }
      }
    })

    const optionsToDelete = questionOptions.filter((option) =>
      options.every((newOption) => newOption.content !== option.content)
    )

    const optionsToCreate = options.filter((option) =>
      questionOptions.every((oldOption) => oldOption.content !== option.content)
    )

    const optionsToUpdate = options.filter((option) =>
      questionOptions.find(
        (oldOption) =>
          oldOption.content === option.content &&
          option.isCorrect !== oldOption.isCorrect
      )
    )

    await Promise.all([
      this.prisma.option.deleteMany({
        where: {
          id: {
            in: optionsToDelete.map((option) => option.id)
          }
        }
      }),
      this.prisma.option.createMany({
        data: optionsToCreate.map((option) => ({
          content: option.content,
          isCorrect: option.isCorrect,
          MultipleChoiceQuestion: {
            connect: {
              id: multipleChoiceQuestion.id
            }
          }
        }))
      }),
      Promise.all(
        optionsToUpdate.map((option) =>
          this.prisma.option.update({
            where: {
              id: option.id
            },
            data: {
              isCorrect: option.isCorrect
            }
          })
        )
      )
    ])
  }

  private async _updateSortQuestion(
    sortQuestion: SortQuestionWithItems,
    id: string,
    content: string,
    difficulty: number,
    hint?: string
  ) {
    await this._updateSortQuestionItems(sortQuestion)
    return this.prisma.question.update({
      where: {
        id
      },
      data: {
        content,
        difficulty,
        hint
      }
    })
  }

  private async _updateSortQuestionItems(sortQuestion: SortQuestionWithItems) {
    const { items } = sortQuestion

    const questionItems = await this.prisma.sortItem.findMany({
      where: {
        SortQuestion: {
          id: sortQuestion.id
        }
      }
    })

    const itemsToDelete = questionItems.filter((item) =>
      items.every((newItem) => newItem.content !== item.content)
    )

    const itemsToCreate = items.filter((item) =>
      questionItems.every((oldItem) => oldItem.content !== item.content)
    )

    const itemsToUpdate = items.filter((item) =>
      questionItems.find(
        (oldItem) =>
          oldItem.content === item.content && item.sort !== oldItem.sort
      )
    )

    await Promise.all([
      this.prisma.sortItem.deleteMany({
        where: {
          id: {
            in: itemsToDelete.map((item) => item.id)
          }
        }
      }),
      this.prisma.sortItem.createMany({
        data: itemsToCreate.map((item) => ({
          content: item.content,
          sort: item.sort,
          SortQuestion: {
            connect: {
              id: sortQuestion.id
            }
          }
        }))
      }),
      Promise.all(
        itemsToUpdate.map((item) =>
          this.prisma.sortItem.update({
            where: {
              id: item.id
            },
            data: {
              sort: item.sort
            }
          })
        )
      )
    ])
  }

  private async _createOpenQuestion(
    openQuestion: { answer: string },
    content: string,
    difficulty: number,
    hint?: string
  ) {
    const { answer } = openQuestion
    return this.prisma.question.create({
      data: {
        type: 'OPEN',
        content,
        difficulty,
        hint,
        OpenQuestion: {
          create: {
            answer
          }
        }
      }
    })
  }

  private async _createMultipleChoiceQuestion(
    multipleChoiceQuestion: MultipleChoiceQuestionWithOptions,
    content: string,
    difficulty: number,
    hint?: string
  ) {
    const { options } = multipleChoiceQuestion
    return this.prisma.question.create({
      data: {
        type: 'MULTIPLE_CHOICE',
        content,
        difficulty,
        hint,
        MultipleChoiceQuestion: {
          create: {
            options: {
              createMany: {
                data: options,
                skipDuplicates: true
              }
            }
          }
        }
      }
    })
  }

  private async _createSortQuestion(
    sortQuestion: SortQuestionWithItems,
    content: string,
    difficulty: number,
    hint?: string
  ) {
    const { items } = sortQuestion
    return this.prisma.question.create({
      data: {
        type: 'SORT',
        content,
        difficulty,
        hint,
        SortQuestion: {
          create: {
            items: {
              createMany: {
                data: items,
                skipDuplicates: true
              }
            }
          }
        }
      }
    })
  }
}
