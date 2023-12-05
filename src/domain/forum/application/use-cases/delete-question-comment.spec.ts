import { makeQuestionComment } from 'tests/factories/make-question-comment.factory'
import { InMemoryQuestionCommentRepository } from 'tests/in-memory/question-comments-in-memory-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let questionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('@use-case/delete-question-comment', async () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentRepository()

    sut = new DeleteQuestionCommentUseCase(questionCommentRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()
    await questionCommentRepository.create(questionComment)

    await sut.handle({
      commentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(questionCommentRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a comment that you didn't create", async () => {
    const questionComment = makeQuestionComment()
    await questionCommentRepository.create(questionComment)

    expect(
      sut.handle({
        commentId: questionComment.id.toString(),
        authorId: 'invalid-user',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
