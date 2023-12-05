import { makeAnswerComment } from 'tests/factories/make-answer-comment.factory'
import { InMemoryAnswerCommentRepository } from 'tests/in-memory/answer-comments-in-memory-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let answerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerCommentUseCase

describe('@use-case/delete-answer-comment', async () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentRepository()

    sut = new DeleteAnswerCommentUseCase(answerCommentRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()
    await answerCommentRepository.create(answerComment)

    await sut.handle({
      commentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    expect(answerCommentRepository.items).toHaveLength(0)
  })

  it("should not be able to delete a comment that you didn't create", async () => {
    const answerComment = makeAnswerComment()
    await answerCommentRepository.create(answerComment)

    expect(
      sut.handle({
        commentId: answerComment.id.toString(),
        authorId: 'invalid-user',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
