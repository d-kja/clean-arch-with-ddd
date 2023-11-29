import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'

import { Slug } from './object-value/slug'

import { Optional } from '@/core/types/optional'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID

  slug: Slug
  title: string
  content: string

  createdAt: Date
  updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(id: UniqueEntityID | undefined) {
    this.props.bestAnswerId = id
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.fromText(title)
    this.touch()
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
    props: Optional<QuestionProps, 'slug' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.fromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
