import { AnswersRepository } from '../repositories/answers-repository'

export interface DeleteAnswerRequest {
  answerId: string
  authorId: string
}
export type DeleteAnswerResponse = Record<string, string>

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async handle({
    authorId,
    answerId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) throw new Error('Resource not found')

    if (answer.authorId.toString() !== authorId) throw new Error('Not allowed')

    await this.answerRepository.delete(answer)

    return {}
  }
}
