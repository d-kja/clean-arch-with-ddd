import { Either, Left, Right } from '@/core/errors/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { UnauthorizedError } from './errors/unauthorized.error'

export interface EditAnswerRequest {
  answerId: string
  authorId: string
  content: string
}
export type EditAnswerResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async handle({
    authorId,
    answerId,
    content,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) return Left.create(new ResourceNotFoundError())

    if (answer.authorId.toString() !== authorId)
      return Left.create(new UnauthorizedError())

    answer.content = content

    await this.answerRepository.save(answer)

    return Right.create({ answer })
  }
}
