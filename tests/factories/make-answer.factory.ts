import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

import { faker } from '@faker-js/faker'

export function makeAnswer(props?: Partial<AnswerProps>, id?: UniqueEntityID) {
  return Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...props,
    },
    id,
  )
}
