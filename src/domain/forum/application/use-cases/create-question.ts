import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Either, Right } from '@/core/errors/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionRepository } from '../repositories/question-repository'

interface CreateQuestionRequest {
  title: string
  content: string
  authorId: string
  attachmentsIds: string[]
}
type CreateQuestionResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async handle({
    title,
    content,
    authorId,
    attachmentsIds,
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      title,
      content,
      authorId: new UniqueEntityID(authorId),
    })

    const attachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(attachments)

    await this.questionRepository.create(question)

    return Right.create({ question })
  }
}
