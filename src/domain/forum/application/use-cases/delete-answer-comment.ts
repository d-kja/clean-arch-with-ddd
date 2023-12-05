import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

export interface DeleteAnswerCommentRequest {
  commentId: string
  authorId: string
}

export type DeleteAnswerCommentResponse = Record<string, string>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}

  async handle({
    commentId,
    authorId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment = await this.answerCommentRepository.findById(commentId)

    if (!answerComment) throw new Error('Resource not found')

    if (answerComment.authorId.toString() !== authorId)
      throw new Error('Missing permissions')

    await this.answerCommentRepository.delete(answerComment)

    return {}
  }
}
