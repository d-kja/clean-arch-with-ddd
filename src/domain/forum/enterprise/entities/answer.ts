import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID

  content: string

  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
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
    props: Optional<AnswerProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Answer(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )
  }
}
