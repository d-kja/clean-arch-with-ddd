import { Either, Left, Right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'

interface GetQuestionBySlugRequest {
  slug: string
}
type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async handle({
    slug,
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.findBySlug(slug)

    if (!question) {
      return Left.create(new ResourceNotFoundError())
    }

    return Right.create({ question })
  }
}
