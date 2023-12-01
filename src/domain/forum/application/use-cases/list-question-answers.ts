import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface ListQuestionAnswerRequest {
  questionId: string
  page: number
}
type ListQuestionAnswerResponse = {
  answers: Answer[]
}

export class ListQuestionAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async handle({
    page,
    questionId,
  }: ListQuestionAnswerRequest): Promise<ListQuestionAnswerResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return { answers }
  }
}
