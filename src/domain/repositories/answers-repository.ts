import { Answer } from '../entities/answer'

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>
}
