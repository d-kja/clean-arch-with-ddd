import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  items: Answer[] = []

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )

    if (answerIndex > -1) {
      this.items.splice(answerIndex, 1)
    }
  }

  async save(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    )

    this.items[answerIndex] = answer
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) return null

    return answer
  }
}