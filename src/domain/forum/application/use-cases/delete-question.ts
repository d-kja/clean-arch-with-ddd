import { Either, Left, Right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UnauthorizedError } from '@/core/errors/unauthorized.error'
import { EmptyObject } from '@/core/types/generic-types'
import { QuestionRepository } from '../repositories/question-repository'

export interface DeleteQuestionRequest {
  questionId: string
  authorId: string
}
export type DeleteQuestionResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  EmptyObject
>

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async handle({
    authorId,
    questionId,
  }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) return Left.create(new ResourceNotFoundError())

    if (question.authorId.toString() !== authorId)
      return Left.create(new UnauthorizedError())

    await this.questionRepository.delete(question)

    return Right.create({})
  }
}
