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

    const { question } = await sut.handle({
      slug: 'example-slug',
    })

    expect(question.id).toBeInstanceOf(UniqueEntityID)
    expect(questionRepository.items).toHaveLength(1)
  })
})
