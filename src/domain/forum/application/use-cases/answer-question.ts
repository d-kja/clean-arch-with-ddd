import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Either, Right } from '@/core/errors/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionRequest {
  authorId: string
  questionId: string

  content: string
}
type AnswerQuestionResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCases {
  constructor(private answersRepository: AnswersRepository) {}

  async handle({
    content,
    authorId,
    questionId,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    })

    await this.answersRepository.create(answer)

    return Right.create({ answer })
  }
}
