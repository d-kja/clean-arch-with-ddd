import { UniqueEntityID } from "@/core/entities/value-object/unique-entity-id";
import { Either, Right } from "@/core/errors/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";

interface AnswerQuestionRequest {
	authorId: string;
	questionId: string;

	content: string;
	attachmentIds: string[];
}
type AnswerQuestionResponse = Either<
	null,
	{
		answer: Answer;
	}
>;

export class AnswerQuestionUseCases {
	constructor(private answersRepository: AnswersRepository) {}

	async handle({
		content,
		authorId,
		questionId,
		attachmentIds,
	}: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityID(authorId),
			questionId: new UniqueEntityID(questionId),
		});

		const attachments = attachmentIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityID(attachmentId),
				answerId: answer.id,
			});
		});

		answer.attachments = new AnswerAttachmentList(attachments);

		await this.answersRepository.create(answer);

		return Right.create({ answer });
	}
}
