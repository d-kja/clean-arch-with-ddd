import { Either, Left, Right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UnauthorizedError } from '@/core/errors/unauthorized.error'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface ChooseQuestionBestAnswerRequest {
  authorId: string
  answerId: string
}
type ChooseQuestionBestAnswerResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswersRepository,
  ) {}

  async handle({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerRequest): Promise<ChooseQuestionBestAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return Left.create(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return Left.create(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return Left.create(new UnauthorizedError())
    }

    question.bestAnswerId = answer.id
    await this.questionRepository.save(question)

    return Right.create({ question })
  }
}
