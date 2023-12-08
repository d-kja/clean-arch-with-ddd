import { Either, Left, Right } from '@/core/errors/either'
import { EmptyObject } from '@/core/types/generic-types'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from './errors/resource-not-found.error'
import { UnauthorizedError } from './errors/unauthorized.error'

export interface DeleteQuestionCommentRequest {
  commentId: string
  authorId: string
}

export type DeleteQuestionCommentResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  EmptyObject
>

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}

  async handle({
    commentId,
    authorId,
  }: DeleteQuestionCommentRequest): Promise<DeleteQuestionCommentResponse> {
    const questionComment =
      await this.questionCommentRepository.findById(commentId)

    if (!questionComment) return Left.create(new ResourceNotFoundError())

    if (questionComment.authorId.toString() !== authorId)
      return Left.create(new UnauthorizedError())

    await this.questionCommentRepository.delete(questionComment)

    return Right.create({})
  }
}
