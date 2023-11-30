import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

export interface EditAnswerRequest {
  answerId: string
  authorId: string
  content: string
}
export type EditAnswerResponse = {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async handle({
    authorId,
    answerId,
    content,
  }: EditAnswerRequest): Promise<EditAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) throw new Error('Resource not found')

    if (answer.authorId.toString() !== authorId) throw new Error('Not allowed')

    answer.content = content

    await this.answerRepository.save(answer)

    return { answer }
  }
}
