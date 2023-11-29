import { Question } from '../../enterprise/entities/question'

export abstract class QuestionRepository {
  abstract create(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
}
