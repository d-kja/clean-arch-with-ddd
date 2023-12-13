import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { AttachmentProps } from './attachment'

export interface AnswerAttachmentProps extends AttachmentProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
    return new AnswerAttachment(props, id)
  }
}
