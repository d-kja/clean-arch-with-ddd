import { Answer } from '@/domain/entities/answer'
import { AnswersRepository } from '../answers-repository'

export class AnswersInMemoryRepository implements AnswersRepository {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async create(_answer: Answer): Promise<void> {}
}
