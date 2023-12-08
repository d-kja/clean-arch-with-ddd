import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { makeAnswerComment } from 'tests/factories/make-answer-comment.factory'
import { InMemoryAnswerCommentRepository } from 'tests/in-memory/answer-comments-in-memory-repository'
import { ListAnswerCommentsUseCase } from './list-answer-comments'

let answerCommentRepository: InMemoryAnswerCommentRepository
let sut: ListAnswerCommentsUseCase

describe('@use-case/list-answer-comments', async () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new ListAnswerCommentsUseCase(answerCommentRepository)
  })

  it('should be able to list the recent answers', async () => {
    await answerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-id'),
      }),
    )
    await answerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-id'),
      }),
    )
    await answerCommentRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-id'),
      }),
    )

    const result = await sut.handle({
      answerId: 'answer-id',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should return a paginated result', async () => {
    for (let index = 1; index <= 22; index++) {
      await answerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-id'),
        }),
      )
    }

    const result = await sut.handle({
      answerId: 'answer-id',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
