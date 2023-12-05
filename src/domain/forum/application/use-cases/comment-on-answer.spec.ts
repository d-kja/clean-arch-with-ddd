import { makeAnswer } from 'tests/factories/make-answer.factory'
import { InMemoryAnswerCommentRepository } from 'tests/in-memory/answer-comments-in-memory-repository'
import { InMemoryAnswersRepository } from 'tests/in-memory/answers-in-memory-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let answerRepository: InMemoryAnswersRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let sut: CommentOnAnswerUseCase

describe('@use-case/comment-on-answer', async () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    answerCommentRepository = new InMemoryAnswerCommentRepository()

    sut = new CommentOnAnswerUseCase(answerRepository, answerCommentRepository)
  })

  it('should be able to comment on a answer', async () => {
    const answer = makeAnswer()
    await answerRepository.create(answer)

    const { answerComment } = await sut.handle({
      answerId: answer.id.toString(),
      authorId: 'author-id',
      content: 'content',
    })

    expect(answerComment.id).toBeTruthy()
    expect(answerCommentRepository.items[0].authorId.toString()).toEqual(
      'author-id',
    )
  })
})
