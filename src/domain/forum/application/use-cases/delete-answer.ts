import { Either, Left, Right } from '@/core/errors/either'
import { EmptyObject } from '@/core/types/generic-types'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { UnauthorizedError } from './errors/unauthorized.error'

export interface DeleteAnswerRequest {
  answerId: string
  authorId: string
}
export type DeleteAnswerResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  EmptyObject
>

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async handle({
    authorId,
    answerId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) return Left.create(new ResourceNotFoundError())

    if (answer.authorId.toString() !== authorId)
      return Left.create(new UnauthorizedError())

    await this.answerRepository.delete(answer)

    return Right.create({})
  }
}
