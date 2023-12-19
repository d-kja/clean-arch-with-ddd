import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Either, Left, Right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UnauthorizedError } from '@/core/errors/unauthorized.error'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachmentRepository } from '../repositories/question-attachments-repository'
import { QuestionRepository } from '../repositories/question-repository'

export interface EditQuestionRequest {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}
export type EditQuestionResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentsRepository: QuestionAttachmentRepository,
  ) {}

  async handle({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionRequest): Promise<EditQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) return Left.create(new ResourceNotFoundError())

    if (question.authorId.toString() !== authorId)
      return Left.create(new UnauthorizedError())

    const questionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      questionAttachments,
    )

    questionAttachmentList.update(
      attachmentsIds.map((attachmentId) =>
        QuestionAttachment.create({
          attachmentId: new UniqueEntityID(attachmentId),
          questionId: new UniqueEntityID(questionId),
        }),
      ),
    )

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionRepository.save(question)

    return Right.create({ question })
  }
}
