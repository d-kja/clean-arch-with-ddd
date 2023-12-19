import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Either, Left, Right } from '@/core/errors/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionRepository } from '../repositories/question-repository'

export interface CommentOnQuestionRequest {
  questionId: string
  authorId: string
  content: string
}

export type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentsRepository,
  ) {}

  async handle({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) return Left.create(new ResourceNotFoundError())

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)

    return Right.create({ questionComment })
  }
}
