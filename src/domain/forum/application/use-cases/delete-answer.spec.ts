import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { makeAnswer } from 'tests/factories/make-answer.factory'
import { InMemoryAnswersRepository } from 'tests/in-memory/answers-in-memory-repository'
import { DeleteAnswerUseCase } from './delete-answer'

let answerRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('@use-case/delete-answer', async () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answerRepository)
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
    })

    expect(answerRepository.items).toHaveLength(0)
  })

  it("shouldn't be able to delete a answer made by somebody else", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer'),
    )
    await answerRepository.create(newAnswer)

    expect(
      sut.handle({
        authorId: 'author-2',
        answerId: 'answer',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
