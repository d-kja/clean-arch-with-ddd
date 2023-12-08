import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { makeQuestion } from 'tests/factories/make-question.factory'
import { InMemoryQuestionRepository } from 'tests/in-memory/question-in-memory-repository'
import { DeleteQuestionUseCase } from './delete-question'

let questionRepository: InMemoryQuestionRepository
let sut: DeleteQuestionUseCase

describe('@use-case/delete-question', async () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestionUseCase(questionRepository)
  })

  it('should be able to delete an existing question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author'),
      },
      new UniqueEntityID('question'),
    )
    await questionRepository.create(newQuestion)

    await sut.handle({
      authorId: 'author',
      questionId: 'question',
    })

    expect(questionRepository.items).toHaveLength(0)
  })

  it("shouldn't be able to delete a question made by somebody else", async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question'),
    )
    await questionRepository.create(newQuestion)

    const result = await sut.handle({
      authorId: 'author-2',
      questionId: 'question',
    })

    expect(result.value).toBeInstanceOf(Error)
  })
})
