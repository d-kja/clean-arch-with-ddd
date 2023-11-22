import { Answer } from '@/entities/answer'
import { AnswersRepository } from '../answers-repository'

export class AnswersInMemoryRepository implements AnswersRepository {
  async create(answer: Answer): Promise<void> {}
}
