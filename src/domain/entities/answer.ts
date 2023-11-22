import { Entity } from '../../core/entities/entity'
import { UniqueEntityID } from '../../core/entities/value-object/unique-entity-id'

interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID

  content: string

  createdAt?: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  get content() {
    return this.props.content
  }

  static create(props: AnswerProps, id?: string) {
    return new Answer(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )
  }
}
