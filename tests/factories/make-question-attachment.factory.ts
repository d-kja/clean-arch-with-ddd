import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
  props?: Partial<QuestionAttachmentProps>,
  id?: UniqueEntityID,
) {
  return QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...props,
    },
    id,
  )
}
