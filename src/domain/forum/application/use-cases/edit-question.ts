import { Either, Left, Right } from '@/core/errors/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { UnauthorizedError } from './errors/unauthorized.error'

export interface EditQuestionRequest {
  questionId: string
  authorId: string
  title: string
  content: string
}
export type EditQuestionResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async handle({
    authorId,
    questionId,
    title,
    content,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) return Left.create(new ResourceNotFoundError())

    if (question.authorId.toString() !== authorId)
      return Left.create(new UnauthorizedError())

    question.title = title
    question.content = content

    await this.questionRepository.save(question)

    return Right.create({ question })
  }
}
