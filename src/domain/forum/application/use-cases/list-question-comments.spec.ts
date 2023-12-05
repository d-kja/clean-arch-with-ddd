import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { makeQuestionComment } from 'tests/factories/make-question-comment.factory'
import { InMemoryQuestionCommentRepository } from 'tests/in-memory/question-comments-in-memory-repository'
import { ListQuestionCommentsUseCase } from './list-question-comments'

let questionCommentRepository: InMemoryQuestionCommentRepository
let sut: ListQuestionCommentsUseCase

describe('@use-case/list-question-comments', async () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new ListQuestionCommentsUseCase(questionCommentRepository)
  })

  it('should be able to list the recent questions', async () => {
    await questionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    )
    await questionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    )
    await questionCommentRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-id'),
      }),
    )

    const { questionComments } = await sut.handle({
      questionId: 'question-id',
      page: 1,
    })

    expect(questionComments).toHaveLength(3)
  })

  it('should return a paginated result', async () => {
    for (let index = 1; index <= 22; index++) {
      await questionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-id'),
        }),
      )
    }

    const { questionComments } = await sut.handle({
      questionId: 'question-id',
      page: 2,
    })

    expect(questionComments).toHaveLength(2)
  })
})
