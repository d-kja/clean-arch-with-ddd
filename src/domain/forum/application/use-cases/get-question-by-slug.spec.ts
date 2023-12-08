import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'

import { makeQuestion } from 'tests/factories/make-question.factory'
import { InMemoryQuestionRepository } from 'tests/in-memory/question-in-memory-repository'
import { Slug } from '../../enterprise/entities/object-value/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let questionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase

describe('@use-case/get-question-by-slug', async () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new GetQuestionBySlugUseCase(questionRepository)
  })

  it('should be able to get a question by the slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-slug'),
    })

    await questionRepository.create(newQuestion)

    const result = await sut.handle({
      slug: 'example-slug',
    })

    expect(result.isRight()).toBe(true)

    if (!result.isRight()) throw new Error('Invalid test')

    expect(result.value.question.id).toBeInstanceOf(UniqueEntityID)
    expect(questionRepository.items).toHaveLength(1)
  })
})
