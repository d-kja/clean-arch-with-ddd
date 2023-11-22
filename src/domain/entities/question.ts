import { Entity } from '../../core/entities/entity'
import { UniqueEntityID } from '../../core/entities/value-object/unique-entity-id'
import { Slug } from './object-value/slug'

interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID

  slug: Slug
  title: string
  content: string

  createdAt?: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  static create(props: Omit<QuestionProps, 'slug'>, id?: string) {
    return new Question(
      {
        ...props,
        slug: Slug.fromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
