import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

export interface DeleteQuestionCommentRequest {
  commentId: string
  authorId: string
}

export type DeleteQuestionCommentResponse = Record<string, string>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}

  async handle({
    commentId,
    authorId,
  }: DeleteQuestionCommentRequest): Promise<DeleteQuestionCommentResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(commentId)

    if (!questionComment) throw new Error('Resource not found')

    if (questionComment.authorId.toString() !== authorId)
      throw new Error('Missing permissions')

    await this.questionCommentRepository.delete(questionComment)

    return {}
  }
}
