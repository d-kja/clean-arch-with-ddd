import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'

export interface EditQuestionRequest {
  questionId: string
  authorId: string
  title: string
  content: string
}
export type EditQuestionResponse = {
  question: Question
}

export class EditQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async handle({
    authorId,
    questionId,
    title,
    content,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) throw new Error('Resource not found')

    if (question.authorId.toString() !== authorId)
      throw new Error('Not allowed')

    question.title = title
    question.content = content

    await this.questionRepository.save(question)

    return { question }
  }
}
