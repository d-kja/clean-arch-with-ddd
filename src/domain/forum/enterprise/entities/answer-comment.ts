import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AnswerCommentProps {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class AnswerComment extends Entity<AnswerCommentProps> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AnswerCommentProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    return new AnswerComment({ ...props, createdAt: new Date() }, id)
  }
}
