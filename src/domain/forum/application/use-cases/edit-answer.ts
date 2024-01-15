import { Either, Left, Right } from "@/core/errors/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found.error";
import { UnauthorizedError } from "@/core/errors/unauthorized.error";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachmentRepository } from "../repositories/answer-attachments-repository";

export interface EditAnswerRequest {
	answerId: string;
	authorId: string;
	content: string;
	attachmentIds: string[];
}
export type EditAnswerResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	{
		answer: Answer;
	}
>;

export class EditAnswerUseCase {
	constructor(
		private answerRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentRepository,
	) {}

	async handle({
		authorId,
		answerId,
		content,
		attachmentIds,
	}: EditAnswerRequest): Promise<EditAnswerResponse> {
		const answer = await this.answerRepository.findById(answerId);

		if (!answer) return Left.create(new ResourceNotFoundError());

		if (answer.authorId.toString() !== authorId)
			return Left.create(new UnauthorizedError());

		const answerAttachments =
			await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

		const answerAttachmentList = new AnswerAttachmentList(answerAttachments);

		answerAttachmentList.update(
			attachmentIds.map((attachmentId) =>
				AnswerAttachment.create({
					attachmentId: new UniqueEntityID(attachmentId),
					answerId: new UniqueEntityID(answerId),
				}),
			),
		);

		answer.content = content;
		answer.attachments = answerAttachmentList;

		await this.answerRepository.save(answer);

		return Right.create({ answer });
	}
}
