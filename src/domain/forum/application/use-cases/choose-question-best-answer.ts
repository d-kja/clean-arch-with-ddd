import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface ChooseQuestionBestAnswerRequest {
  authorId: string
  answerId: string
}
type ChooseQuestionBestAnswerResponse = {
  question: Question
}

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

    if (!answer) throw new Error('Resource not found')

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) throw new Error('resource not found')

    if (question.authorId.toString() !== authorId)
      throw new Error('not allowed')

    question.bestAnswerId = answer.id
    await this.questionRepository.save(question)

    return { question }
  }
}
