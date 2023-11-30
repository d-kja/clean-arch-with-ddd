import { QuestionRepository } from '../repositories/question-repository'

export interface DeleteQuestionRequest {
  questionId: string
  authorId: string
}
export type DeleteQuestionResponse = Record<string, string>

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async handle({
    authorId,
    questionId,
  }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) throw new Error('Resource not found')

    if (question.authorId.toString() !== authorId)
      throw new Error('Not allowed')

    await this.questionRepository.delete(question)

    return {}
  }
}
