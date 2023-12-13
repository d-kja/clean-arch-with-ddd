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
    const result = await sut.handle({
      title: 'example',
      content: '...',
      authorId: '...',
      attachmentsIds: ['1', '2'],
    })

    expect(result.value?.question.id).toBeInstanceOf(UniqueEntityID)
    expect(questionRepository.items).toHaveLength(1)
    expect(questionRepository.items[0]).toEqual(result.value?.question)
    expect(questionRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(questionRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
