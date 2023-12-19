import { Either, Left, Right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { UnauthorizedError } from '@/core/errors/unauthorized.error'
import { EmptyObject } from '@/core/types/generic-types'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

export interface DeleteAnswerCommentRequest {
  commentId: string
  authorId: string
}

export type DeleteAnswerCommentResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  EmptyObject
>

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}

  async handle({
    commentId,
    authorId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const answerComment = await this.answerCommentRepository.findById(commentId)

    if (!answerComment) {
      return Left.create(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return Left.create(new UnauthorizedError())
    }

    await this.answerCommentRepository.delete(answerComment)

    return Right.create({})
  }
}
