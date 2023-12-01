import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'

interface ListRecentQuestionsRequest {
  page: number
}
type ListRecentQuestionsResponse = {
  questions: Question[]
}

export class ListRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async handle({
    page,
  }: ListRecentQuestionsRequest): Promise<ListRecentQuestionsResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return { questions }
  }
}
