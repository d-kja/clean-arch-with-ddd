import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Attachment, AttachmentProps } from './attachment'

export interface QuestionAttachmentProps extends AttachmentProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Attachment<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachmentProps, id: UniqueEntityID) {
    return new QuestionAttachment(props, id)
  }
}
