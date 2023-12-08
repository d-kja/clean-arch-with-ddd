import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { makeAnswer } from 'tests/factories/make-answer.factory'
import { InMemoryAnswersRepository } from 'tests/in-memory/answers-in-memory-repository'
import { EditAnswerUseCase } from './edit-answer'

let answerRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('@use-case/delete-answer', async () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answerRepository)
  })

  it('should be able to delete an existing answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author'),
      },
      new UniqueEntityID('answer'),
    )
    await answerRepository.create(newAnswer)

    await sut.handle({
      authorId: 'author',
      answerId: 'answer',
      content: 'content',
    })

    expect(answerRepository.items[0]).toMatchObject({
      content: 'content',
    })
  })

  it("shouldn't be able to edit a answer made by somebody else", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer'),
    )
    await answerRepository.create(newAnswer)

    const result = await sut.handle({
      authorId: 'author-2',
      answerId: 'answer',
      content: 'content',
    })

    expect(result.value).toBeInstanceOf(Error)
  })
})
