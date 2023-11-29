import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Slug } from '@/domain/forum/enterprise/entities/object-value/slug'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'

export function makeQuestion(
  props: Partial<QuestionProps>,
  id?: UniqueEntityID,
) {
  return Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      slug: Slug.create('slug-example'),
      ...props,
    },
    id,
  )
}
