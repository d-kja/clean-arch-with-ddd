import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'

import { InMemoryQuestionRepository } from 'tests/in-memory/question-in-memory-repository'
import { CreateQuestionUseCase } from './create-question'

let questionRepository: InMemoryQuestionRepository
let sut: CreateQuestionUseCase

describe('@use-case/create-question', async () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new CreateQuestionUseCase(questionRepository)
  })

  it('should be able to create a new question', async () => {
    const { question } = await sut.handle({
      title: 'example',
      content: '...',
      authorId: '...',
    })

    expect(question.id).toBeInstanceOf(UniqueEntityID)
    expect(questionRepository.items).toHaveLength(1)
  })
})
