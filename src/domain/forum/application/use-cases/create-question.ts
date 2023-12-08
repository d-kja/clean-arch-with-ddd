import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Either, Right } from '@/core/errors/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'

interface CreateQuestionRequest {
  title: string
  content: string
  authorId: string
}
type CreateQuestionResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async handle({
    title,
    content,
    authorId,
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      title,
      content,
      authorId: new UniqueEntityID(authorId),
    })

    await this.questionRepository.create(question)

    return Right.create({ question })
  }
}
